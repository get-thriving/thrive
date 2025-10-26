"""The command for removing a habit."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.habits.service.remove_service import HabitRemoveService
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HabitRemoveArgs, None]
):
    """The command for removing a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await HabitRemoveService().remove(
            context.domain_context, uow, progress_reporter, args.ref_id
        )
