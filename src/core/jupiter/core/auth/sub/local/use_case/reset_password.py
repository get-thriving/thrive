"""Use case for reseting a password."""

from jupiter.core.application.use_case.login_local import InvalidLoginMethodError
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.root import AuthLocal, IncorrectRecoveryTokenError
from jupiter.core.auth.sub.local.sub.recovery_token.plain import RecoveryTokenPlain
from jupiter.core.auth.sub.local.sub.recovery_token.root import RecoveryToken
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.users.root import (
    UserNotFoundError,
    UserRepository,
)
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
                if user.auth_method != UserAuthMethod.LOCAL:
                    raise InvalidLoginMethodError(
                        "This account does not use local authentication"
                    )

                auth = await uow.get_for(AuthLocal).load_by_parent(user.ref_id)
                recovery_token_entity = await uow.get_for(RecoveryToken).load_by_parent(
                    auth.ref_id
                )
                auth, recovery_token_entity, new_recovery_token = auth.reset_password(
                    ctx=context.domain_context,
                    recovery_token_entity=recovery_token_entity,
                    recovery_token=args.recovery_token,
                    new_password=args.new_password,
                    new_password_repeat=args.new_password_repeat,
                )
                auth = await uow.get_for(AuthLocal).save(auth)
                await uow.get_for(RecoveryToken).save(recovery_token_entity)
            except (UserNotFoundError, IncorrectRecoveryTokenError) as err:
                raise InvalidResetPasswordCredentialsError(
                    "Username or recovery token invalid"
                ) from err

        return ResetPasswordResult(new_recovery_token=new_recovery_token)
