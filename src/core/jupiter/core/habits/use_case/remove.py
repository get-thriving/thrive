"""The command for removing a habit."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.remove import HabitRemoveService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HabitRemoveArgs(JupiterRemoveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitRemoveUseCase(JupiterRemoveCrownEntityUseCase[HabitRemoveArgs, None]):
    """The command for removing a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, Habit, args.ref_id)

        await HabitRemoveService().remove(
            context.domain_context, uow, progress_reporter, args.ref_id
        )
