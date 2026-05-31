"""Use case for creating or logging in a user after Google OAuth callback."""

from typing import cast

from jupiter.core.application.use_case.login_local import InvalidLoginMethodError
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.google.google_auth_code import GoogleAuthCode
from jupiter.core.auth.sub.google.root import (
    AuthGoogle,
    AuthGoogleNotFoundError,
    AuthGoogleRepository,
)
from jupiter.core.auth.sub.google.user_info import GoogleUserInfo
from jupiter.core.backend_blend import JupiterAuthProvider
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
class InitCreateUserOrLoginGoogleArgs(UseCaseArgsBase):
    """Init create user or login (Google auth) use case arguments."""

    google_auth_code: GoogleAuthCode
    callback_uri: SystemUrl


@use_case_result
class InitCreateUserOrLoginGoogleResult(UseCaseResultBase):
    """Init create user or login (Google auth) use case result."""

    new_user: User
    auth_token_ext: AuthTokenExt


@secure_class
class InitCreateUserOrLoginGoogleUseCase(
    JupiterGuestMutationUseCase[
        InitCreateUserOrLoginGoogleArgs, InitCreateUserOrLoginGoogleResult
    ]
):
    """Use case for creating or logging in a user after Google OAuth callback."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: InitCreateUserOrLoginGoogleArgs,
    ) -> InitCreateUserOrLoginGoogleResult:
        """Execute the command's action."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            raise InputValidationError("Google OAuth is not enabled")
        if self._ports.google_oauth_client is None:
            raise RuntimeError("Google OAuth client is not configured")

        google_user_info = await self._ports.google_oauth_client.get_user_info(
            args.google_auth_code.code_raw,
            args.callback_uri,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                auth_google = await uow.get(
                    AuthGoogleRepository
                ).load_by_google_subject_id(google_user_info.google_subject_id)
            except AuthGoogleNotFoundError:
                if google_user_info.encrypted_refresh_token is None:
                    raise InputValidationError(
                        "Google did not return a refresh token for a new account"
                    ) from None
                user = await self._create_new_google_user(
                    context,
                    google_user_info=google_user_info,
                    uow=uow,
                )
            else:
                user = await uow.get_for(User).load_by_id(
                    auth_google.user.ref_id, allow_archived=True
                )
                if user.auth_method != UserAuthMethod.GOOGLE:
                    raise InvalidLoginMethodError(
                        "This account does not use Google authentication"
                    )
                if google_user_info.encrypted_refresh_token is not None:
                    auth_google = auth_google.update_refresh_token(
                        context.domain_context,
                        google_user_info.encrypted_refresh_token,
                    )
                    await uow.get_for(AuthGoogle).save(auth_google)

        if user.archived:
            raise UserAlreadyExistsButIsArchivedError(
                "This account was previously closed and cannot be used to sign in again."
            )

        auth_token = self._auth_token_stamper.stamp_for_general_long(user.ref_id)

        return InitCreateUserOrLoginGoogleResult(
            new_user=user,
            auth_token_ext=auth_token.to_ext(),
        )

    async def _create_new_google_user(
        self,
        context: JupiterGuestMutationContext,
        google_user_info: GoogleUserInfo,
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

        new_user = User.new_standard_user_google(
            ctx=context.domain_context,
            email_address=google_user_info.email_address,
            name=google_user_info.user_name,
            feature_flag_controls=user_feature_flags_controls,
            feature_flags=user_feature_flags,
        )
        new_user = await uow.get_for(User).create(new_user)

        encrypted_refresh_token = google_user_info.encrypted_refresh_token
        assert encrypted_refresh_token is not None

        new_auth = AuthGoogle.new_auth_google(
            context.domain_context,
            user_ref_id=new_user.ref_id,
            google_subject_id=google_user_info.google_subject_id,
            refresh_token=encrypted_refresh_token,
        )
        await uow.get_for(AuthGoogle).create(new_auth)

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
