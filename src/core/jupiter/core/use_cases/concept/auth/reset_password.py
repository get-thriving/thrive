"""Use case for reseting a password."""

from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.domain.concept.auth.auth import Auth, IncorrectRecoveryTokenError
from jupiter.core.domain.concept.auth.password_new_plain import PasswordNewPlain
from jupiter.core.domain.concept.auth.recovery_token_plain import RecoveryTokenPlain
from jupiter.core.domain.concept.user.user import (
    UserNotFoundError,
    UserRepository,
)
from jupiter.core.domain.core.email_address import EmailAddress
from jupiter.framework_new.progress_reporter import (
    ProgressReporter,
)
from jupiter.framework_new.secure import secure_class
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


class InvalidResetPasswordCredentialsError(Exception):
    """Error raised when either an email address or recovery token are not good."""


@use_case_args
class ResetPasswordArgs(UseCaseArgsBase):
    """Reset password args."""

    email_address: EmailAddress
    recovery_token: RecoveryTokenPlain
    new_password: PasswordNewPlain
    new_password_repeat: PasswordNewPlain


@use_case_result
class ResetPasswordResult(UseCaseResultBase):
    """Reset password result."""

    new_recovery_token: RecoveryTokenPlain


@secure_class
class ResetPasswordUseCase(
    JupiterGuestMutationUseCase[ResetPasswordArgs, ResetPasswordResult]
):
    """Use case for reseting a password."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: ResetPasswordArgs,
    ) -> ResetPasswordResult:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                user = await uow.get(UserRepository).load_by_email_address(
                    args.email_address
                )
                auth = await uow.get_for(Auth).load_by_parent(user.ref_id)
                auth, new_recovery_token = auth.reset_password(
                    ctx=context.domain_context,
                    recovery_token=args.recovery_token,
                    new_password=args.new_password,
                    new_password_repeat=args.new_password_repeat,
                )
                auth = await uow.get_for(Auth).save(auth)
            except (UserNotFoundError, IncorrectRecoveryTokenError) as err:
                raise InvalidResetPasswordCredentialsError(
                    "Username or recovery token invalid"
                ) from err

        return ResetPasswordResult(new_recovery_token=new_recovery_token)
