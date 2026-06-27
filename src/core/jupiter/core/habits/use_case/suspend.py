"""The command for suspend a habit."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HabitSuspendArgs(JupiterUpdateCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitSuspendUseCase(JupiterUpdateCrownEntityUseCase[HabitSuspendArgs, None]):
    """The command for suspending a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitSuspendArgs,
    ) -> None:
        """Execute the command's action."""
        habit = await self.load_entity(
            uow, context.user.ref_id, Habit, args.ref_id
        )
        habit = habit.suspend(context.domain_context)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)
