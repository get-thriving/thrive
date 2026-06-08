"""Load all the calendar specific entities for a given date and period."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.todo.root import TodoTask
from jupiter.core.vacations.root import Vacation
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class CalendarLoadForDateAndPeriodArgs(UseCaseArgsBase):
    """Args."""

    right_now: ADate
    period: RecurringTaskPeriod
    stats_subperiod: RecurringTaskPeriod | None


@use_case_result_part
class ScheduleInDayEventEntry(UseCaseResultBase):
    """Result entry."""

    event: ScheduleEventInDay
    tags: list[Tag]
    time_event: TimeEventInDayBlock
    stream: ScheduleStream


@use_case_result_part
class ScheduleFullDaysEventEntry(UseCaseResultBase):
    """Result entry."""

    event: ScheduleEventFullDays
    tags: list[Tag]
    time_event: TimeEventFullDaysBlock
    stream: ScheduleStream


@use_case_result_part
class BigPlanEntry(UseCaseResultBase):
    """Result entry."""

    big_plan: BigPlan
    time_events: list[TimeEventInDayBlock]


@use_case_result_part
class TodoTaskEntry(UseCaseResultBase):
    """Result entry."""

    todo_task: TodoTask
    inbox_task: InboxTask
    time_events: list[TimeEventInDayBlock]


@use_case_result_part
class HabitEntry(UseCaseResultBase):
    """Result entry."""

    habit: Habit
    time_events: list[TimeEventInDayBlock]


@use_case_result_part
class ChoreEntry(UseCaseResultBase):
    """Result entry."""

    chore: Chore
    time_events: list[TimeEventInDayBlock]


@use_case_result_part
class TimePlanActivityEntry(UseCaseResultBase):
    """Result entry."""

    time_plan_activity: TimePlanActivity
    target_inbox_task: InboxTask | None
    target_big_plan: BigPlan | None
    time_events: list[TimeEventInDayBlock]


@use_case_result_part
class PersonOccasionEntry(UseCaseResultBase):
    """Result entry."""

    contact: Contact
    occasion: Occasion
    occasion_time_event: TimeEventFullDaysBlock


@use_case_result_part
class VacationEntry(UseCaseResultBase):
    """Result entry."""

    vacation: Vacation
    time_event: TimeEventFullDaysBlock


@use_case_result_part
class CalendarEventsEntries(UseCaseResultBase):
    """Full entries for results."""

    schedule_event_full_days_entries: list[ScheduleFullDaysEventEntry]
    schedule_event_in_day_entries: list[ScheduleInDayEventEntry]
    big_plan_entries: list[BigPlanEntry]
    todo_task_entries: list[TodoTaskEntry]
    habit_entries: list[HabitEntry]
    chore_entries: list[ChoreEntry]
    time_plan_activity_entries: list[TimePlanActivityEntry]
    person_occasion_entries: list[PersonOccasionEntry]
    vacation_entries: list[VacationEntry]


@use_case_result_part
class CalendarEventsStatsPerSubperiod(UseCaseResultBase):
    """Stats about a particular subperiod."""

    period: RecurringTaskPeriod
    period_start_date: ADate
    schedule_event_full_days_cnt: int
    schedule_event_in_day_cnt: int
    big_plan_cnt: int
    todo_task_cnt: int
    habit_cnt: int
    chore_cnt: int
    time_plan_activity_cnt: int
    person_birthday_cnt: int
    vacation_cnt: int


@use_case_result_part
class CalendarEventsStats(UseCaseResultBase):
    """Stats about events in a period."""

    subperiod: RecurringTaskPeriod
    per_subperiod: list[CalendarEventsStatsPerSubperiod]


@use_case_result
class CalendarLoadForDateAndPeriodResult(UseCaseResultBase):
    """Result."""

    right_now: ADate
    period: RecurringTaskPeriod
    stats_subperiod: RecurringTaskPeriod | None
    period_start_date: ADate
    period_end_date: ADate
    prev_period_start_date: ADate
    next_period_start_date: ADate
    entries: CalendarEventsEntries | None
    stats: CalendarEventsStats | None


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class CalendarLoadForDateAndPeriodUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        CalendarLoadForDateAndPeriodArgs, CalendarLoadForDateAndPeriodResult
    ]
):
    """Use case for loading all the calendar entities for a given date and period."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: CalendarLoadForDateAndPeriodArgs,
    ) -> CalendarLoadForDateAndPeriodResult:
        """Execute the action."""
        from jupiter.core.calendar.service.load_for_date_and_period import (
            CalendarLoadForDateAndPeriodService,
        )

        CalendarLoadForDateAndPeriodService.validate_stats_subperiod(
            args.period, args.stats_subperiod
        )

        workspace = context.workspace
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )

        schedule_streams = await uow.get_for(ScheduleStream).find_all_generic(
            parent_ref_id=schedule_domain.ref_id,
            allow_archived=False,
        )
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream] = {
            ss.ref_id: ss for ss in schedule_streams
        }

        return await CalendarLoadForDateAndPeriodService().load(
            uow,
            workspace,
            args.right_now,
            args.period,
            args.stats_subperiod,
            time_event_domain,
            schedule_domain,
            schedule_streams_by_ref_id,
            schedule_stream_ref_id=None,
        )
