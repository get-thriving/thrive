"""The command for removing a habit streak inactive period."""

from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class HabitStreakInactivePeriodRemoveArgs(JupiterRemoveCrownEntityArgs):
    """Habit streak inactive period remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitStreakInactivePeriodRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[HabitStreakInactivePeriodRemoveArgs, None]
):
    """The command for removing a habit streak inactive period."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitStreakInactivePeriodRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        period = await uow.get_for(HabitStreakInactivePeriod).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            Habit,
            period.habit.ref_id,
        )

        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            HabitStreakInactivePeriod,
            args.ref_id,
        )
