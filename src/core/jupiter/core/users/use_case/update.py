"""The command for updating a user's properties."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.timezone import Timezone
from jupiter.core.users.name import UserName
from jupiter.core.users.root import User
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class UserUpdateArgs(UseCaseArgsBase):
    """User update args."""

    name: UpdateAction[UserName]
    timezone: UpdateAction[Timezone]


@mutation_use_case()
class UserUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[UserUpdateArgs, None]
):
    """The command for updating a user's properties."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UserUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user.update(
            context.domain_context,
            name=args.name,
            timezone=args.timezone,
        )
        await uow.get_for(User).save(user)
