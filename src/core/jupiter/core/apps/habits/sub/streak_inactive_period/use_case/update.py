"""The command for updating a habit streak inactive period."""

from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
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


@use_case_args
class HabitStreakInactivePeriodUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Habit streak inactive period update args."""

    ref_id: EntityId
    name: EntityName
    start_date: ADate
    end_date: ADate


@use_case_result
class HabitStreakInactivePeriodUpdateResult(UseCaseResultBase):
    """Habit streak inactive period update result."""

    updated_period: HabitStreakInactivePeriod


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitStreakInactivePeriodUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[
        HabitStreakInactivePeriodUpdateArgs, HabitStreakInactivePeriodUpdateResult
    ]
):
    """The command for updating a habit streak inactive period."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitStreakInactivePeriodUpdateArgs,
    ) -> HabitStreakInactivePeriodUpdateResult:
        """Execute the command's action."""
        period = await uow.get_for(HabitStreakInactivePeriod).load_by_id(args.ref_id)
        await self.check_entity(
            uow,
            context.user.ref_id,
            Habit,
            period.habit.ref_id,
        )

        updated_period = period.update(
            context.domain_context,
            name=args.name,
            start_date=args.start_date,
            end_date=args.end_date,
        )
        updated_period = await uow.get_for(HabitStreakInactivePeriod).save(
            updated_period
        )
        await progress_reporter.mark_updated(updated_period)

        return HabitStreakInactivePeriodUpdateResult(updated_period=updated_period)
