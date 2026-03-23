"""Use case for creating a time event associated with a habit."""

from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.common.time_in_day import TimeInDay
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.habits.root import Habit
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimeEventInDayBlockCreateForHabitArgs(UseCaseArgsBase):
    """Args."""

    habit_ref_id: EntityId
    start_date: ADate
    start_time_in_day: TimeInDay
    duration_mins: int


@use_case_result
class TimeEventInDayBlockCreateForHabitResult(UseCaseResultBase):
    """Result."""

    new_time_event: TimeEventInDayBlock


@mutation_use_case()
class TimeEventInDayBlockCreateForHabitUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimeEventInDayBlockCreateForHabitArgs,
        TimeEventInDayBlockCreateForHabitResult,
    ]
):
    """Use case for creating a time event associated with a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimeEventInDayBlockCreateForHabitArgs,
    ) -> TimeEventInDayBlockCreateForHabitResult:
        """Execute the command's action."""
        workspace = context.workspace
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )

        habit = await uow.get_for(Habit).load_by_id(args.habit_ref_id)

        new_time_event = TimeEventInDayBlock.new_time_event_for_habit(
            context.domain_context,
            time_event_domain_ref_id=time_event_domain.ref_id,
            habit_ref_id=habit.ref_id,
            start_date=args.start_date,
            start_time_in_day=args.start_time_in_day,
            duration_mins=args.duration_mins,
        )
        new_time_event = await uow.get_for(TimeEventInDayBlock).create(new_time_event)

        return TimeEventInDayBlockCreateForHabitResult(
            new_time_event=new_time_event
        )
