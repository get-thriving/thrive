"""The command for creating a habit streak inactive period."""

from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
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
class HabitStreakInactivePeriodCreateArgs(JupiterCreateCrownEntityArgs):
    """Habit streak inactive period create args."""

    habit_ref_id: EntityId
    name: EntityName
    start_date: ADate
    end_date: ADate


@use_case_result
class HabitStreakInactivePeriodCreateResult(UseCaseResultBase):
    """Habit streak inactive period create result."""

    new_period: HabitStreakInactivePeriod


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitStreakInactivePeriodCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        HabitStreakInactivePeriodCreateArgs, HabitStreakInactivePeriodCreateResult
    ]
):
    """The command for creating a habit streak inactive period."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitStreakInactivePeriodCreateArgs,
    ) -> HabitStreakInactivePeriodCreateResult:
        """Execute the command's action."""
        await self.load_entity(uow, context.user.ref_id, Habit, args.habit_ref_id)

        new_period = HabitStreakInactivePeriod.new_habit_streak_inactive_period(
            context.domain_context,
            habit_ref_id=args.habit_ref_id,
            name=args.name,
            start_date=args.start_date,
            end_date=args.end_date,
        )
        new_period = await generic_creator(uow, progress_reporter, new_period)

        return HabitStreakInactivePeriodCreateResult(new_period=new_period)
