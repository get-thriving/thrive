"""Use case for changing a password."""

from jupiter.core.application.use_case.login_local import InvalidLoginMethodError
from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.password_plain import PasswordPlain
from jupiter.core.auth.sub.local.root import AuthLocal, IncorrectPasswordError
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


class InvalidChangePasswordCredentialsError(Exception):
    """Error raised when the old password isn't good."""


@use_case_args
class ChangePasswordArgs(UseCaseArgsBase):
    """Change password args."""

    current_password: PasswordPlain
    new_password: PasswordNewPlain
    new_password_repeat: PasswordNewPlain


@secure_class
@mutation_use_case()
class ChangePasswordUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChangePasswordArgs, None]
):
    """Use case for changing a password."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChangePasswordArgs,
    ) -> None:
        """Execute the command's action."""
        if context.user.auth_method != UserAuthMethod.LOCAL:
            raise InvalidLoginMethodError(
                "This account does not use local authentication"
            )

        try:
            auth = await uow.get_for(AuthLocal).load_by_parent(context.user.ref_id)
            auth = auth.change_password(
                ctx=context.domain_context,
                current_password=args.current_password,
                new_password=args.new_password,
                new_password_repeat=args.new_password_repeat,
            )
            auth = await uow.get_for(AuthLocal).save(auth)
        except IncorrectPasswordError as err:
            raise InvalidChangePasswordCredentialsError("Invalid password") from err
