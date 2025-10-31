"""Use case for changing a password."""

from jupiter.core.auth.password_new_plain import PasswordNewPlain
from jupiter.core.auth.password_plain import PasswordPlain
from jupiter.core.auth.root import Auth, IncorrectPasswordError
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
        try:
            auth = await uow.get_for(Auth).load_by_parent(context.user.ref_id)
            auth = auth.change_password(
                ctx=context.domain_context,
                current_password=args.current_password,
                new_password=args.new_password,
                new_password_repeat=args.new_password_repeat,
            )
            auth = await uow.get_for(Auth).save(auth)
        except IncorrectPasswordError as err:
            raise InvalidChangePasswordCredentialsError("Invalid password") from err
