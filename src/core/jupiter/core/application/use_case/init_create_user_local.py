"""Use case for creating a user and their local authentication information."""

from typing import cast

from jupiter.core.auth.sub.email_verification.service.create_email_verification_attempt import (
    CreateEmailVerificationAttemptService,
)
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.features import UserFeature
from jupiter.core.gamification.score_log import ScoreLog
from jupiter.core.users.name import UserName
from jupiter.core.users.root import (
    User,
    UserAlreadyExistsButIsArchivedError,
    UserNotFoundError,
    UserRepository,
)
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
)
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class InitCreateUserLocalArgs(UseCaseArgsBase):
    """Init create user (local auth) use case arguments."""

    user_email_address: EmailAddress
    user_name: UserName
    auth_password: PasswordNewPlain
    auth_password_repeat: PasswordNewPlain


@use_case_result
class InitCreateUserLocalResult(UseCaseResultBase):
    """Init create user (local auth) use case result."""

    new_user: User
    auth_token_ext: AuthTokenExt


@secure_class
class InitCreateUserLocalUseCase(
    JupiterGuestMutationUseCase[InitCreateUserLocalArgs, InitCreateUserLocalResult]
):
    """Use case for creating a user and their local authentication information."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: InitCreateUserLocalArgs,
    ) -> InitCreateUserLocalResult:
        """Execute the command's action."""
        (user_feature_flags_controls, _) = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )

        user_feature_flags = {}
        for user_feature in UserFeature:
            user_feature_flags[user_feature] = (
                user_feature_flags_controls.standard_flag_for(user_feature)
            )

        for_app_review = False  # args.for_app_review

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                existing_user = await uow.get(UserRepository).load_by_email_address(
                    args.user_email_address
                )
            except UserNotFoundError:
                pass
            else:
                if existing_user.archived:
                    raise UserAlreadyExistsButIsArchivedError(
                        "This account was previously closed and cannot be used to sign in again."
                    )

            if for_app_review:
                new_user = User.new_app_store_review_user(
                    ctx=context.domain_context,
                    email_address=args.user_email_address,
                    name=args.user_name,
                    feature_flag_controls=user_feature_flags_controls,
                )
            else:
                new_user = User.new_standard_user_local(
                    ctx=context.domain_context,
                    email_address=args.user_email_address,
                    name=args.user_name,
                    feature_flag_controls=user_feature_flags_controls,
                    feature_flags=user_feature_flags,
                )
            new_user = await uow.get_for(User).create(new_user)

            new_auth = AuthLocal.new_auth(
                context.domain_context,
                user_ref_id=new_user.ref_id,
                password=args.auth_password,
                password_repeat=args.auth_password_repeat,
            )
            await uow.get_for(AuthLocal).create(new_auth)

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

        if not new_user.verified:
            await CreateEmailVerificationAttemptService(
                self._ports.domain_storage_engine,
                self._ports.email_sender,
            ).do_it(
                ctx=context.domain_context,
                right_now=self._time_provider.get_current_time(),
                user_id=new_user.ref_id,
            )

        auth_token = self._auth_token_stamper.stamp_for_general_long(new_user.ref_id)

        return InitCreateUserLocalResult(
            new_user=new_user,
            auth_token_ext=auth_token.to_ext(),
        )
