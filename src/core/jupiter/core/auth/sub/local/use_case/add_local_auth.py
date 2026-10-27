"""Use case for adding a password to an account that signed up another way."""

from jupiter.core.auth.service.auth_link_errors import AuthMethodAlreadyLinkedError
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.auth.sub.local.sub.recovery_token.plain import RecoveryTokenPlain
from jupiter.core.auth.sub.local.sub.recovery_token.root import RecoveryToken
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class AddLocalAuthArgs(UseCaseArgsBase):
    """Add local auth arguments."""

    new_password: PasswordNewPlain
    new_password_repeat: PasswordNewPlain


@use_case_result
class AddLocalAuthResult(UseCaseResultBase):
    """Add local auth result."""

    new_recovery_token: RecoveryTokenPlain


@secure_class
@mutation_use_case()
class AddLocalAuthUseCase(
    JupiterTransactionalLoggedInMutationUseCase[AddLocalAuthArgs, AddLocalAuthResult]
):
    """Use case for adding a password to an account that signed up another way."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AddLocalAuthArgs,
    ) -> AddLocalAuthResult:
        """Execute the command's action."""
        if not context.user.verified:
            # Password login is keyed on the email address, so it has to be proven.
            raise InputValidationError(
                "Verify your email address before adding a password"
            )

        try:
            await uow.get_for(AuthLocal).load_by_parent(context.user.ref_id)
        except EntityNotFoundError:
            pass
        else:
            raise AuthMethodAlreadyLinkedError("This account already has a password")

        new_auth = AuthLocal.new_auth(
            context.domain_context,
            user_ref_id=context.user.ref_id,
            password=args.new_password,
            password_repeat=args.new_password_repeat,
        )
        new_auth = await uow.get_for(AuthLocal).create(new_auth)

        new_recovery_token_entity, new_recovery_token = (
            RecoveryToken.new_recovery_token(
                context.domain_context,
                auth_ref_id=new_auth.ref_id,
            )
        )
        await uow.get_for(RecoveryToken).create(new_recovery_token_entity)

        return AddLocalAuthResult(new_recovery_token=new_recovery_token)
