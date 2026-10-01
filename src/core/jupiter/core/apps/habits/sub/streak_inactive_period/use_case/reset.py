"""The command for marking a habit's streak so far as inactive."""

from jupiter.core.apps.habits.streak_mark import HabitStreakMarkRepository
from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
    reset_streak_bounds,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class HabitStreakInactivePeriodResetArgs(JupiterCreateCrownEntityArgs):
    """Habit streak inactive period reset args."""

    habit_ref_id: EntityId
    name: EntityName


@use_case_result
class HabitStreakInactivePeriodResetResult(UseCaseResultBase):
    """Habit streak inactive period reset result."""

    new_period: HabitStreakInactivePeriod


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitStreakInactivePeriodResetUseCase(
    JupiterCreateCrownEntityUseCase[
        HabitStreakInactivePeriodResetArgs, HabitStreakInactivePeriodResetResult
    ]
):
    """Mark the streak so far inactive, leaving today open."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitStreakInactivePeriodResetArgs,
    ) -> HabitStreakInactivePeriodResetResult:
        """Execute the command's action."""
        habit = await self.load_entity(
            uow, context.user.ref_id, Habit, args.habit_ref_id
        )
        marks = await uow.get(HabitStreakMarkRepository).find_all(habit.ref_id)
        earliest_mark_date = min((mark.date for mark in marks), default=None)
        today = ADate.from_timestamp(context.domain_context.action_timestamp)
        start_date, end_date = reset_streak_bounds(
            today,
            earliest_mark_date,
            ADate.from_timestamp(habit.created_time),
        )

        new_period = HabitStreakInactivePeriod.new_habit_streak_inactive_period(
            context.domain_context,
            habit_ref_id=habit.ref_id,
            name=args.name,
            start_date=start_date,
            end_date=end_date,
        )
        new_period = await generic_creator(uow, progress_reporter, new_period)

        return HabitStreakInactivePeriodResetResult(new_period=new_period)
