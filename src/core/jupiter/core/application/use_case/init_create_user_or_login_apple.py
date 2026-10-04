"""Use case for creating or logging in a user after Apple OAuth callback."""

from typing import cast

from jupiter.core.application.use_case.login_local import InvalidLoginMethodError
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.apple.apple_auth_code import AppleAuthCode
from jupiter.core.auth.sub.apple.root import (
    AuthApple,
    AuthAppleNotFoundError,
    AuthAppleRepository,
)
from jupiter.core.auth.sub.apple.user_info import AppleUserInfo
from jupiter.core.auth.sub.email_verification.service.create_email_verification_attempt import (
    CreateEmailVerificationAttemptService,
)
from jupiter.core.backend_blend import (
    JupiterAuthProvider,
    JupiterEmailVerificationStrategy,
)
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.features import UserFeature
from jupiter.core.gamification.score_log import ScoreLog
from jupiter.core.users.root import User, UserAlreadyExistsButIsArchivedError
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
)
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class InitCreateUserOrLoginAppleArgs(UseCaseArgsBase):
    """Init create user or login (Apple auth) use case arguments."""

    apple_auth_code: AppleAuthCode
    callback_uri: SystemUrl
    apple_user_json: str | None


@use_case_result
class InitCreateUserOrLoginAppleResult(UseCaseResultBase):
    """Init create user or login (Apple auth) use case result."""

    new_user: User
    auth_token_ext: AuthTokenExt


@secure_class
class InitCreateUserOrLoginAppleUseCase(
    JupiterGuestMutationUseCase[
        InitCreateUserOrLoginAppleArgs, InitCreateUserOrLoginAppleResult
    ]
):
    """Use case for creating or logging in a user after Apple OAuth callback."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: InitCreateUserOrLoginAppleArgs,
    ) -> InitCreateUserOrLoginAppleResult:
        """Execute the command's action."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            raise InputValidationError("Apple OAuth is not enabled")
        if self._ports.apple_oauth_client is None:
            raise RuntimeError("Apple OAuth client is not configured")

        apple_user_info = await self._ports.apple_oauth_client.get_user_info(
            args.apple_auth_code.code_raw,
            args.callback_uri,
            args.apple_user_json,
        )

        is_new_user = False

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                auth_apple = await uow.get(
                    AuthAppleRepository
                ).load_by_apple_subject_id(apple_user_info.apple_subject_id)
            except AuthAppleNotFoundError:
                if apple_user_info.encrypted_refresh_token is None:
                    raise InputValidationError(
                        "Apple did not return a refresh token for a new account"
                    ) from None
                user = await self._create_new_apple_user(
                    context,
                    apple_user_info=apple_user_info,
                    uow=uow,
                )
                is_new_user = True
            else:
                user = await uow.get_for(User).load_by_id(
                    auth_apple.user.ref_id, allow_archived=True
                )
                if user.auth_method != UserAuthMethod.APPLE:
                    raise InvalidLoginMethodError(
                        "This account does not use Apple authentication"
                    )
                if apple_user_info.encrypted_refresh_token is not None:
                    auth_apple = auth_apple.update_refresh_token(
                        context.domain_context,
                        apple_user_info.encrypted_refresh_token,
                    )
                    await uow.get_for(AuthApple).save(auth_apple)

        if user.archived:
            raise UserAlreadyExistsButIsArchivedError(
                "This account was previously closed and cannot be used to sign in again."
            )

        if is_new_user and not user.verified:
            await CreateEmailVerificationAttemptService(
                self._ports.domain_storage_engine,
                self._ports.email_sender,
                self._global_properties.env,
            ).do_it(
                ctx=context.domain_context,
                right_now=self._time_provider.get_current_time(),
                user_id=user.ref_id,
            )

        auth_token = self._auth_token_stamper.stamp_for_general_long(user.ref_id)

        return InitCreateUserOrLoginAppleResult(
            new_user=user,
            auth_token_ext=auth_token.to_ext(),
        )

    async def _create_new_apple_user(
        self,
        context: JupiterGuestMutationContext,
        apple_user_info: AppleUserInfo,
        uow: DomainUnitOfWork,
    ) -> User:
        (user_feature_flags_controls, _) = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )

        user_feature_flags = {}
        for user_feature in UserFeature:
            user_feature_flags[user_feature] = (
                user_feature_flags_controls.standard_flag_for(user_feature)
            )

        if (
            self._global_properties.email_verification_strategy
            == JupiterEmailVerificationStrategy.NONE
        ):
            verified = True
        else:
            verified = apple_user_info.verified

        new_user = User.new_standard_user_apple(
            ctx=context.domain_context,
            email_address=apple_user_info.email_address,
            name=apple_user_info.user_name,
            feature_flag_controls=user_feature_flags_controls,
            feature_flags=user_feature_flags,
            verified=verified,
        )
        new_user = await uow.get_for(User).create(new_user)

        encrypted_refresh_token = apple_user_info.encrypted_refresh_token
        assert encrypted_refresh_token is not None

        new_auth = AuthApple.new_auth_apple(
            context.domain_context,
            user_ref_id=new_user.ref_id,
            apple_subject_id=apple_user_info.apple_subject_id,
            refresh_token=encrypted_refresh_token,
        )
        await uow.get_for(AuthApple).create(new_auth)

        new_score_log = ScoreLog.new_score_log(
            ctx=context.domain_context,
            user_ref_id=new_user.ref_id,
        )
        await uow.get_for(ScoreLog).create(new_score_log)

        new_web_ui_settings = WebUiSettings.new_web_ui_settings(
            ctx=context.domain_context,
            user_ref_id=new_user.ref_id,
        )
        await uow.get_for(WebUiSettings).create(new_web_ui_settings)

        return new_user
