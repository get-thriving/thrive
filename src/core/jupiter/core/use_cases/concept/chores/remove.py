"""The command for removing a chore."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.chores.service.remove_service import ChoreRemoveService
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChoreRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChoreRemoveArgs, None]
):
    """The command for removing a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: ChoreRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await ChoreRemoveService().remove(
            context.domain_context, uow, progress_reporter, args.ref_id
        )
