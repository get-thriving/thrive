"""Use case for changing a password."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.auth.auth import Auth, IncorrectPasswordError
from jupiter.core.domain.concept.auth.password_new_plain import PasswordNewPlain
from jupiter.core.domain.concept.auth.password_plain import PasswordPlain
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.secure import secure_class
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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
