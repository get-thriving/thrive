"""Shared service for loading calendar data for a date and period."""

from typing import cast

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.prm.root import PRM
from jupiter.core.apps.prm.sub.person.root import Person
from jupiter.core.apps.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.apps.schedule.domain import ScheduleDomain
from jupiter.core.apps.schedule.sub.event_full_days.root import ScheduleEventFullDays
from jupiter.core.apps.schedule.sub.event_in_day.root import ScheduleEventInDay
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.apps.vacations.root import Vacation
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
    TimeEventFullDaysBlockStats,
    TimeEventFullDaysBlockStatsPerGroup,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
    TimeEventInDayBlockRepository,
    TimeEventInDayBlockStats,
    TimeEventInDayBlockStatsPerGroup,
)
from jupiter.core.common.timezone import Timezone
from jupiter.core.crown_entity_reader import CrownEntityReader
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_result,
    use_case_result_part,
)


@use_case_result_part
class ScheduleInDayEventEntry(UseCaseResultBase):
    """Result entry."""

    event: ScheduleEventInDay
    tags: list[Tag]
    location: Location | None
    time_event: TimeEventInDayBlock
    stream: ScheduleStream
    owner: UserLight


@use_case_result_part
class ScheduleFullDaysEventEntry(UseCaseResultBase):
    """Result entry."""

    event: ScheduleEventFullDays
    tags: list[Tag]
    location: Location | None
    time_event: TimeEventFullDaysBlock
    stream: ScheduleStream
    owner: UserLight


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
    target_todo_task: TodoTask | None
    target_habit: Habit | None
    target_chore: Chore | None
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
    additional_timezones: list[Timezone]


def _time_events_in_day_for_owner_type_unique(
    time_events_in_day: list[TimeEventInDayBlock],
    owner_type: str,
) -> dict[EntityId, TimeEventInDayBlock]:
    return {
        te.owner.ref_id: te
        for te in time_events_in_day
        if te.owner.the_type == owner_type
    }


def _time_events_in_day_grouped_by_owner_ref_id(
    time_events_in_day: list[TimeEventInDayBlock],
    owner_type: str,
) -> dict[EntityId, list[TimeEventInDayBlock]]:
    result: dict[EntityId, list[TimeEventInDayBlock]] = {}
    for te in time_events_in_day:
        if te.owner.the_type != owner_type:
            continue
        result.setdefault(te.owner.ref_id, []).append(te)
    return result


class CalendarLoadForDateAndPeriodService:
    """Shared service for loading calendar data for a date and period."""

    @staticmethod
    def validate_stats_subperiod(
        period: RecurringTaskPeriod,
        stats_subperiod: RecurringTaskPeriod | None,
    ) -> None:
        """Validate stats subperiod args."""
        if stats_subperiod is not None:
            if period is RecurringTaskPeriod.DAILY:
                raise InputValidationError(
                    "Stats subperiod is not allowed for daily period."
                )
            elif stats_subperiod not in period.all_smaller_periods:
                raise InputValidationError(
                    f"Stats subperiod {stats_subperiod} is not smaller than period {period}."
                )

    @staticmethod
    def compute_schedules(
        right_now: ADate,
        period: RecurringTaskPeriod,
    ) -> tuple[schedules.Schedule, schedules.Schedule, schedules.Schedule]:
        """Compute the current, previous, and next schedules for a period."""
        schedule = schedules.get_schedule(
            period=period,
            right_now=right_now.to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )
        prev_schedule = schedules.get_schedule(
            period=period,
            right_now=schedule.first_day.subtract_days(
                1
            ).to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )
        next_schedule = schedules.get_schedule(
            period=period,
            right_now=schedule.end_day.add_days(1).to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )
        return schedule, prev_schedule, next_schedule

    async def load(
        self,
        uow: DomainUnitOfWork,
        workspace: Workspace,
        right_now: ADate,
        period: RecurringTaskPeriod,
        stats_subperiod: RecurringTaskPeriod | None,
        time_event_domain: TimeEventDomain,
        schedule_domain: ScheduleDomain,
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream],
        *,
        crown_entity_reader: CrownEntityReader,
        additional_timezones: list[Timezone],
        schedule_stream_ref_id: EntityId | None = None,
        user_ref_id: EntityId | None = None,
    ) -> CalendarLoadForDateAndPeriodResult:
        """Load calendar entries and stats for a workspace and period."""
        schedule, prev_schedule, next_schedule = self.compute_schedules(
            right_now, period
        )

        needs_entries = (
            period is RecurringTaskPeriod.DAILY or period is RecurringTaskPeriod.WEEKLY
        )
        needs_stats = (
            schedule.period != RecurringTaskPeriod.DAILY and stats_subperiod is not None
        )

        # Entries and (non-stream) stats both read from the same raw time-event
        # rows for this schedule window - this happens together for WEEKLY.
        # Fetch once and share instead of hitting Postgres twice for the same
        # date range.
        time_events_full_days: list[TimeEventFullDaysBlock] | None = None
        time_events_in_day: list[TimeEventInDayBlock] | None = None
        if needs_entries or (needs_stats and schedule_stream_ref_id is None):
            time_events_full_days, time_events_in_day = (
                await self._fetch_raw_time_events(uow, time_event_domain, schedule)
            )

        entries: CalendarEventsEntries | None = None
        if needs_entries:
            entries = await self.build_entries(
                uow,
                workspace,
                schedule,
                time_event_domain,
                schedule_domain,
                schedule_streams_by_ref_id,
                crown_entity_reader=crown_entity_reader,
                schedule_stream_ref_id=schedule_stream_ref_id,
                user_ref_id=user_ref_id,
                time_events_full_days=time_events_full_days,
                time_events_in_day=time_events_in_day,
            )

        stats: CalendarEventsStats | None = None
        if needs_stats:
            assert stats_subperiod is not None
            stats = await self.build_stats(
                uow,
                schedule,
                stats_subperiod,
                time_event_domain,
                schedule_domain=schedule_domain,
                crown_entity_reader=crown_entity_reader,
                schedule_stream_ref_id=schedule_stream_ref_id,
                time_events_full_days=time_events_full_days,
                time_events_in_day=time_events_in_day,
            )

        return CalendarLoadForDateAndPeriodResult(
            right_now=right_now,
            period=period,
            stats_subperiod=stats_subperiod,
            period_start_date=schedule.first_day,
            period_end_date=schedule.end_day,
            prev_period_start_date=prev_schedule.first_day,
            next_period_start_date=next_schedule.first_day,
            entries=entries,
            stats=stats,
            additional_timezones=additional_timezones,
        )

    async def _fetch_raw_time_events(
        self,
        uow: DomainUnitOfWork,
        time_event_domain: TimeEventDomain,
        schedule: schedules.Schedule,
    ) -> tuple[list[TimeEventFullDaysBlock], list[TimeEventInDayBlock]]:
        """Fetch the raw time event rows for a schedule window, for reuse by entries and stats."""
        time_events_full_days: list[TimeEventFullDaysBlock] = await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_all_between(
            parent_ref_id=time_event_domain.ref_id,
            start_date=schedule.first_day,
            end_date=schedule.end_day,
        )

        time_events_in_day: list[TimeEventInDayBlock] = await uow.get(
            TimeEventInDayBlockRepository
        ).find_all_between(
            parent_ref_id=time_event_domain.ref_id,
            # Events can be at most 48hrs long, and to catch those that start before the period
            # but end inside it we have this little approach.
            start_date=schedule.first_day.subtract_days(2),
            end_date=schedule.end_day,
        )

        return time_events_full_days, time_events_in_day

    async def build_entries(
        self,
        uow: DomainUnitOfWork,
        workspace: Workspace,
        schedule: schedules.Schedule,
        time_event_domain: TimeEventDomain,
        schedule_domain: ScheduleDomain,
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream],
        *,
        crown_entity_reader: CrownEntityReader,
        schedule_stream_ref_id: EntityId | None = None,
        user_ref_id: EntityId | None = None,
        time_events_full_days: list[TimeEventFullDaysBlock] | None = None,
        time_events_in_day: list[TimeEventInDayBlock] | None = None,
    ) -> CalendarEventsEntries:
        """Build calendar entries for the schedule period."""
        if time_events_full_days is None or time_events_in_day is None:
            time_events_full_days, time_events_in_day = (
                await self._fetch_raw_time_events(uow, time_event_domain, schedule)
            )

        time_events_full_days_for_schedule_events_full_days: dict[
            EntityId, TimeEventFullDaysBlock
        ] = {
            te.owner.ref_id: te
            for te in time_events_full_days
            if te.owner.the_type == NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
        }
        time_events_in_day_for_schedule_events_in_day = (
            _time_events_in_day_for_owner_type_unique(
                time_events_in_day,
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            )
        )

        await self._merge_shared_schedule_event_time_blocks(
            uow,
            schedule,
            schedule_streams_by_ref_id,
            time_events_full_days_for_schedule_events_full_days,
            time_events_in_day_for_schedule_events_in_day,
            user_ref_id=user_ref_id,
        )

        schedule_events_full_days = []
        if len(time_events_full_days_for_schedule_events_full_days) > 0:
            schedule_events_full_days = await crown_entity_reader.load_all_entities(
                ScheduleEventFullDays,
                list(time_events_full_days_for_schedule_events_full_days.keys()),
                allow_archived=False,
            )

        await self._ensure_streams_for_events(
            uow,
            schedule_streams_by_ref_id,
            [se.schedule_stream_ref_id for se in schedule_events_full_days],
        )

        full_days_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
        if schedule_events_full_days:
            full_days_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                owner=[
                    EntityLink.std(
                        NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                        se.ref_id,
                    )
                    for se in schedule_events_full_days
                ],
            )
            all_fd_tag_ref_ids: list[EntityId] = []
            for tl in full_days_tag_links:
                all_fd_tag_ref_ids.extend(tl.ref_ids)
            if all_fd_tag_ref_ids:
                all_full_days_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=None,
                    allow_archived=False,
                    ref_id=list(set(all_fd_tag_ref_ids)),
                )
                all_full_days_tags_by_ref_id = {t.ref_id: t for t in all_full_days_tags}
            else:
                all_full_days_tags_by_ref_id = {}
            for tag_link in full_days_tag_links:
                full_days_tags_by_schedule_event_ref_id[
                    cast(EntityId, tag_link.owner.ref_id)
                ] = [
                    all_full_days_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_full_days_tags_by_ref_id
                ]

        included_schedule_events_full_days = [
            se
            for se in schedule_events_full_days
            if se.schedule_stream_ref_id in schedule_streams_by_ref_id
            and se.ref_id in time_events_full_days_for_schedule_events_full_days
        ]
        full_days_owners_by_event_ref_id = await self._owners_for_schedule_events(
            uow,
            NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
            [se.ref_id for se in included_schedule_events_full_days],
        )
        full_days_locations_by_event_ref_id = await self._locations_for_schedule_events(
            uow,
            NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
            [se.ref_id for se in included_schedule_events_full_days],
        )
        schedule_event_full_days_entries = [
            ScheduleFullDaysEventEntry(
                event=se,
                tags=full_days_tags_by_schedule_event_ref_id.get(se.ref_id, []),
                location=full_days_locations_by_event_ref_id.get(se.ref_id),
                time_event=time_events_full_days_for_schedule_events_full_days[
                    se.ref_id
                ],
                stream=schedule_streams_by_ref_id[se.schedule_stream_ref_id],
                owner=full_days_owners_by_event_ref_id[se.ref_id],
            )
            for se in included_schedule_events_full_days
        ]

        schedule_events_in_day = []
        if len(time_events_in_day_for_schedule_events_in_day) > 0:
            schedule_events_in_day = await crown_entity_reader.load_all_entities(
                ScheduleEventInDay,
                list(time_events_in_day_for_schedule_events_in_day.keys()),
                allow_archived=False,
            )

        await self._ensure_streams_for_events(
            uow,
            schedule_streams_by_ref_id,
            [se.schedule_stream_ref_id for se in schedule_events_in_day],
        )

        in_day_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
        if schedule_events_in_day:
            in_day_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                owner=[
                    EntityLink.std(
                        NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value, se.ref_id
                    )
                    for se in schedule_events_in_day
                ],
            )
            all_in_day_tag_ref_ids: list[EntityId] = []
            for tl in in_day_tag_links:
                all_in_day_tag_ref_ids.extend(tl.ref_ids)
            if all_in_day_tag_ref_ids:
                all_in_day_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=None,
                    allow_archived=False,
                    ref_id=list(set(all_in_day_tag_ref_ids)),
                )
                all_in_day_tags_by_ref_id = {t.ref_id: t for t in all_in_day_tags}
            else:
                all_in_day_tags_by_ref_id = {}
            for tag_link in in_day_tag_links:
                in_day_tags_by_schedule_event_ref_id[
                    cast(EntityId, tag_link.owner.ref_id)
                ] = [
                    all_in_day_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_in_day_tags_by_ref_id
                ]

        included_schedule_events_in_day = [
            se
            for se in schedule_events_in_day
            if se.schedule_stream_ref_id in schedule_streams_by_ref_id
            and se.ref_id in time_events_in_day_for_schedule_events_in_day
        ]
        in_day_owners_by_event_ref_id = await self._owners_for_schedule_events(
            uow,
            NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            [se.ref_id for se in included_schedule_events_in_day],
        )
        in_day_locations_by_event_ref_id = await self._locations_for_schedule_events(
            uow,
            NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            [se.ref_id for se in included_schedule_events_in_day],
        )
        schedule_event_in_day_entries = [
            ScheduleInDayEventEntry(
                event=se,
                tags=in_day_tags_by_schedule_event_ref_id.get(se.ref_id, []),
                location=in_day_locations_by_event_ref_id.get(se.ref_id),
                time_event=time_events_in_day_for_schedule_events_in_day[se.ref_id],
                stream=schedule_streams_by_ref_id[se.schedule_stream_ref_id],
                owner=in_day_owners_by_event_ref_id[se.ref_id],
            )
            for se in included_schedule_events_in_day
        ]

        if schedule_stream_ref_id is not None:
            schedule_event_full_days_entries = [
                entry
                for entry in schedule_event_full_days_entries
                if entry.event.schedule_stream_ref_id == schedule_stream_ref_id
            ]
            schedule_event_in_day_entries = [
                entry
                for entry in schedule_event_in_day_entries
                if entry.event.schedule_stream_ref_id == schedule_stream_ref_id
            ]
            return CalendarEventsEntries(
                schedule_event_full_days_entries=schedule_event_full_days_entries,
                schedule_event_in_day_entries=schedule_event_in_day_entries,
                big_plan_entries=[],
                todo_task_entries=[],
                habit_entries=[],
                chore_entries=[],
                time_plan_activity_entries=[],
                person_occasion_entries=[],
                vacation_entries=[],
            )

        time_events_in_day_for_big_plans = _time_events_in_day_grouped_by_owner_ref_id(
            time_events_in_day,
            NamedEntityTag.BIG_PLAN.value,
        )
        big_plans: list[BigPlan] = []
        if len(time_events_in_day_for_big_plans) > 0:
            big_plans = await crown_entity_reader.load_all_entities(
                BigPlan,
                list(time_events_in_day_for_big_plans.keys()),
                allow_archived=JupiterArchivalReason.GC,
            )
        big_plan_entries = [
            BigPlanEntry(
                big_plan=big_plan,
                time_events=time_events_in_day_for_big_plans[big_plan.ref_id],
            )
            for big_plan in big_plans
        ]

        time_events_in_day_for_todo_tasks = _time_events_in_day_grouped_by_owner_ref_id(
            time_events_in_day,
            NamedEntityTag.TODO_TASK.value,
        )
        todo_tasks: list[TodoTask] = []
        todo_task_inbox_tasks: dict[EntityId, InboxTask] = {}
        inbox_task_collection: InboxTaskCollection | None = None
        if len(time_events_in_day_for_todo_tasks) > 0:
            todo_tasks = await crown_entity_reader.load_all_entities(
                TodoTask,
                list(time_events_in_day_for_todo_tasks.keys()),
                allow_archived=JupiterArchivalReason.GC,
            )
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            linked_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                owner=[
                    EntityLink.std(NamedEntityTag.TODO_TASK.value, tt.ref_id)
                    for tt in todo_tasks
                ],
                allow_archived=JupiterArchivalReason.GC,
            )
            for it in linked_inbox_tasks:
                if it.owner.ref_id not in todo_task_inbox_tasks:
                    todo_task_inbox_tasks[it.owner.ref_id] = it
        todo_task_entries = [
            TodoTaskEntry(
                todo_task=todo_task,
                inbox_task=todo_task_inbox_tasks[todo_task.ref_id],
                time_events=time_events_in_day_for_todo_tasks[todo_task.ref_id],
            )
            for todo_task in todo_tasks
            if todo_task.ref_id in todo_task_inbox_tasks
        ]

        time_events_in_day_for_habits = _time_events_in_day_grouped_by_owner_ref_id(
            time_events_in_day,
            NamedEntityTag.HABIT.value,
        )
        habits: list[Habit] = []
        if len(time_events_in_day_for_habits) > 0:
            habits = await crown_entity_reader.load_all_entities(
                Habit,
                list(time_events_in_day_for_habits.keys()),
                allow_archived=JupiterArchivalReason.GC,
            )
        habit_entries = [
            HabitEntry(
                habit=habit,
                time_events=time_events_in_day_for_habits[habit.ref_id],
            )
            for habit in habits
        ]

        time_events_in_day_for_chores = _time_events_in_day_grouped_by_owner_ref_id(
            time_events_in_day,
            NamedEntityTag.CHORE.value,
        )
        chores: list[Chore] = []
        if len(time_events_in_day_for_chores) > 0:
            chores = await crown_entity_reader.load_all_entities(
                Chore,
                list(time_events_in_day_for_chores.keys()),
                allow_archived=JupiterArchivalReason.GC,
            )
        chore_entries = [
            ChoreEntry(
                chore=chore,
                time_events=time_events_in_day_for_chores[chore.ref_id],
            )
            for chore in chores
        ]

        time_events_in_day_for_activities = _time_events_in_day_grouped_by_owner_ref_id(
            time_events_in_day,
            NamedEntityTag.TIME_PLAN_ACTIVITY.value,
        )
        time_plan_activities: list[TimePlanActivity] = []
        if len(time_events_in_day_for_activities) > 0:
            time_plan_activities = await crown_entity_reader.load_all_entities(
                TimePlanActivity,
                list(time_events_in_day_for_activities.keys()),
                allow_archived=True,
            )

        activity_target_inbox_task_ref_ids = [
            a.target.ref_id for a in time_plan_activities if a.is_target_inbox_task
        ]
        activity_target_inbox_tasks_by_id: dict[EntityId, InboxTask] = {}
        if activity_target_inbox_task_ref_ids:
            if inbox_task_collection is None:
                inbox_task_collection = await uow.get_for(
                    InboxTaskCollection
                ).load_by_parent(workspace.ref_id)
            activity_target_inbox_tasks = await uow.get_for(InboxTask).find_all(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                filter_ref_ids=activity_target_inbox_task_ref_ids,
            )
            activity_target_inbox_tasks_by_id = {
                it.ref_id: it for it in activity_target_inbox_tasks
            }

        activity_target_big_plan_ref_ids = [
            a.target.ref_id for a in time_plan_activities if a.is_target_big_plan
        ]
        activity_target_big_plans_by_id: dict[EntityId, BigPlan] = {}
        if activity_target_big_plan_ref_ids:
            activity_target_big_plans = await crown_entity_reader.load_all_entities(
                BigPlan,
                activity_target_big_plan_ref_ids,
                allow_archived=True,
            )
            activity_target_big_plans_by_id = {
                bp.ref_id: bp for bp in activity_target_big_plans
            }

        activity_target_todo_task_ref_ids = [
            a.target.ref_id for a in time_plan_activities if a.is_target_todo_task
        ]
        activity_target_todo_tasks_by_id: dict[EntityId, TodoTask] = {}
        if activity_target_todo_task_ref_ids:
            activity_target_todo_tasks = await uow.get_for(TodoTask).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=activity_target_todo_task_ref_ids,
            )
            activity_target_todo_tasks_by_id = {
                tt.ref_id: tt for tt in activity_target_todo_tasks
            }

        activity_target_habit_ref_ids = [
            a.target.ref_id for a in time_plan_activities if a.is_target_habit
        ]
        activity_target_habits_by_id: dict[EntityId, Habit] = {}
        if activity_target_habit_ref_ids:
            activity_target_habits = await uow.get_for(Habit).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=activity_target_habit_ref_ids,
            )
            activity_target_habits_by_id = {h.ref_id: h for h in activity_target_habits}

        activity_target_chore_ref_ids = [
            a.target.ref_id for a in time_plan_activities if a.is_target_chore
        ]
        activity_target_chores_by_id: dict[EntityId, Chore] = {}
        if activity_target_chore_ref_ids:
            activity_target_chores = await uow.get_for(Chore).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=activity_target_chore_ref_ids,
            )
            activity_target_chores_by_id = {c.ref_id: c for c in activity_target_chores}

        time_plan_activity_entries = [
            TimePlanActivityEntry(
                time_plan_activity=activity,
                target_inbox_task=activity_target_inbox_tasks_by_id.get(
                    activity.target.ref_id
                ),
                target_big_plan=activity_target_big_plans_by_id.get(
                    activity.target.ref_id
                ),
                target_todo_task=activity_target_todo_tasks_by_id.get(
                    activity.target.ref_id
                ),
                target_habit=activity_target_habits_by_id.get(activity.target.ref_id),
                target_chore=activity_target_chores_by_id.get(activity.target.ref_id),
                time_events=time_events_in_day_for_activities[activity.ref_id],
            )
            for activity in time_plan_activities
        ]

        time_events_full_days_for_occasions: dict[EntityId, TimeEventFullDaysBlock] = {
            te.owner.ref_id: te
            for te in time_events_full_days
            if te.owner.the_type == NamedEntityTag.OCCASION.value
        }
        persons = []
        persons_by_ref_id: dict[EntityId, Person] = {}
        occasions = []
        contact_domain = None
        contact_links_by_person: dict[EntityId, ContactLink] = {}
        if len(time_events_full_days_for_occasions) > 0:
            prm = await uow.get_for(PRM).load_by_parent(
                workspace.ref_id,
            )
            persons = await uow.get_for(Person).find_all(
                parent_ref_id=prm.ref_id,
                allow_archived=True,
            )

            persons_by_ref_id = {p.ref_id: p for p in persons}
            occasions = await uow.get_for(Occasion).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(time_events_full_days_for_occasions.keys()),
            )

            # Load contact domain and links for persons
            contact_domain = await uow.get_for(ContactDomain).load_by_parent(
                workspace.ref_id,
            )
            contact_links = await uow.get_for(ContactLink).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.PERSON.value, p.ref_id)
                    for p in persons
                ],
            )
            for link in contact_links:
                contact_links_by_person[link.owner.ref_id] = link

        occasion_contact_ref_ids: list[EntityId] = []
        for occasion in occasions:
            person = persons_by_ref_id[occasion.person.ref_id]
            contact_link = contact_links_by_person.get(person.ref_id)
            if contact_link and contact_link.contacts_ref_ids:
                # Use the first contact associated with this person
                # In a real scenario, you might want a more sophisticated selection
                occasion_contact_ref_ids.append(contact_link.contacts_ref_ids[0])
        contacts_by_ref_id: dict[EntityId, Contact] = {}
        if occasion_contact_ref_ids:
            occasion_contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                ref_id=list(set(occasion_contact_ref_ids)),
            )
            contacts_by_ref_id = {c.ref_id: c for c in occasion_contacts}

        person_occasion_entries = []
        for occasion in occasions:
            person = persons_by_ref_id[occasion.person.ref_id]
            contact_link = contact_links_by_person.get(person.ref_id)
            if contact_link and contact_link.contacts_ref_ids:
                contact_ref_id = contact_link.contacts_ref_ids[0]
                contact = contacts_by_ref_id.get(contact_ref_id)
                if contact is None:
                    continue
                person_occasion_entries.append(
                    PersonOccasionEntry(
                        contact=contact,
                        occasion=occasion,
                        occasion_time_event=time_events_full_days_for_occasions[
                            occasion.ref_id
                        ],
                    )
                )

        time_event_full_days_for_vacations: dict[EntityId, TimeEventFullDaysBlock] = {
            te.owner.ref_id: te
            for te in time_events_full_days
            if te.owner.the_type == NamedEntityTag.VACATION.value
        }
        vacations = []
        if len(time_event_full_days_for_vacations) > 0:
            vacations = await crown_entity_reader.load_all_entities(
                Vacation,
                list(time_event_full_days_for_vacations.keys()),
                allow_archived=False,
            )
        vacation_entries = [
            VacationEntry(
                vacation=vacation,
                time_event=time_event_full_days_for_vacations[vacation.ref_id],
            )
            for vacation in vacations
        ]

        entries = CalendarEventsEntries(
            schedule_event_full_days_entries=schedule_event_full_days_entries,
            schedule_event_in_day_entries=schedule_event_in_day_entries,
            big_plan_entries=big_plan_entries,
            todo_task_entries=todo_task_entries,
            habit_entries=habit_entries,
            chore_entries=chore_entries,
            time_plan_activity_entries=time_plan_activity_entries,
            person_occasion_entries=person_occasion_entries,
            vacation_entries=vacation_entries,
        )

        return entries

    async def _merge_shared_schedule_event_time_blocks(
        self,
        uow: DomainUnitOfWork,
        schedule: schedules.Schedule,
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream],
        time_events_full_days_by_event: dict[EntityId, TimeEventFullDaysBlock],
        time_events_in_day_by_event: dict[EntityId, TimeEventInDayBlock],
        *,
        user_ref_id: EntityId | None,
    ) -> None:
        """Pull in time blocks for shared schedule events outside this workspace."""
        # Ask the database for the blocks in this window that the viewer may
        # see, rather than enumerating reachable events and fetching their
        # blocks. Enumerating first made the work scale with how many events
        # the streams hold and the user can reach in total instead of with the
        # window, which is what made calendar loads take seconds for
        # long-lived accounts. Keeping the visibility test in SQL also means
        # blocks from other workspaces are never returned here - this path
        # also serves the unauthenticated published-stream endpoint.
        stream_ref_ids = list(schedule_streams_by_ref_id.keys())

        for full_days_block in await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_all_for_visible_schedule_events_between(
            schedule.first_day,
            schedule.end_day,
            stream_ref_ids,
            user_ref_id,
        ):
            # Defensive: the visibility query must already restrict to schedule
            # event owners, but never key a non-schedule block by ref_id alone
            # (ref_ids collide across entity types).
            if (
                full_days_block.owner.the_type
                != NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
            ):
                continue
            time_events_full_days_by_event.setdefault(
                full_days_block.owner.ref_id, full_days_block
            )

        for in_day_block in await uow.get(
            TimeEventInDayBlockRepository
        ).find_all_for_visible_schedule_events_between(
            schedule.first_day.subtract_days(2),
            schedule.end_day,
            stream_ref_ids,
            user_ref_id,
        ):
            if (
                in_day_block.owner.the_type
                != NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value
            ):
                continue
            time_events_in_day_by_event.setdefault(
                in_day_block.owner.ref_id, in_day_block
            )

    async def _ensure_streams_for_events(
        self,
        uow: DomainUnitOfWork,
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream],
        schedule_stream_ref_ids: list[EntityId],
    ) -> None:
        """Load any streams referenced by events that are not already in the map."""
        missing = [
            ref_id
            for ref_id in set(schedule_stream_ref_ids)
            if ref_id not in schedule_streams_by_ref_id
        ]
        if not missing:
            return
        streams = await uow.get_for(ScheduleStream).find_all_generic(
            parent_ref_id=None,
            allow_archived=False,
            ref_id=missing,
        )
        for stream in streams:
            schedule_streams_by_ref_id[stream.ref_id] = stream

    async def _owners_for_schedule_events(
        self,
        uow: DomainUnitOfWork,
        entity_type: str,
        event_ref_ids: list[EntityId],
    ) -> dict[EntityId, UserLight]:
        """Bulk-resolve owner users for schedule events."""
        if not event_ref_ids:
            return {}
        owner_links = [
            EntityLink.std(entity_type, event_ref_id) for event_ref_id in event_ref_ids
        ]
        owner_ref_ids_by_event_ref_id = await OwnerUserRefIdsForEntitiesService().do_it(
            uow, owner_links
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_event_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}
        return {
            event_ref_id: owners_by_ref_id[owner_ref_ids_by_event_ref_id[event_ref_id]]
            for event_ref_id in event_ref_ids
        }

    async def _locations_for_schedule_events(
        self,
        uow: DomainUnitOfWork,
        entity_type: str,
        event_ref_ids: list[EntityId],
    ) -> dict[EntityId, Location]:
        """Bulk-resolve the single location linked to each schedule event."""
        if not event_ref_ids:
            return {}
        owner_links = [
            EntityLink.std(entity_type, event_ref_id) for event_ref_id in event_ref_ids
        ]
        location_links = await uow.get_for(LocationLink).find_all_generic(
            allow_archived=False,
            owner=owner_links,
        )
        event_location_ref_id = {
            link.owner.ref_id: link.locations_ref_ids[0]
            for link in location_links
            if link.locations_ref_ids
        }
        all_location_ref_ids = list(event_location_ref_id.values())
        if not all_location_ref_ids:
            return {}
        locations = await uow.get_for(Location).find_all_generic(
            allow_archived=False,
            ref_id=list(set(all_location_ref_ids)),
        )
        locations_by_ref_id = {loc.ref_id: loc for loc in locations}
        return {
            event_ref_id: locations_by_ref_id[location_ref_id]
            for event_ref_id, location_ref_id in event_location_ref_id.items()
            if location_ref_id in locations_by_ref_id
        }

    @staticmethod
    def _stats_from_full_days_time_events(
        time_events: list[TimeEventFullDaysBlock],
    ) -> TimeEventFullDaysBlockStats:
        """Compute the same grouping `stats_for_all_between` would, from already-fetched rows."""
        counts: dict[tuple[ADate, str], int] = {}
        for te in time_events:
            key = (te.start_date, te.owner.the_type)
            counts[key] = counts.get(key, 0) + 1
        return TimeEventFullDaysBlockStats(
            per_groups=[
                TimeEventFullDaysBlockStatsPerGroup(
                    date=date, entity_tag=entity_tag, cnt=cnt
                )
                for (date, entity_tag), cnt in counts.items()
            ]
        )

    @staticmethod
    def _stats_from_in_day_time_events(
        time_events: list[TimeEventInDayBlock],
    ) -> TimeEventInDayBlockStats:
        """Compute the same grouping `stats_for_all_between` would, from already-fetched rows."""
        counts: dict[tuple[ADate, str], int] = {}
        for te in time_events:
            key = (te.start_date, te.owner.the_type)
            counts[key] = counts.get(key, 0) + 1
        return TimeEventInDayBlockStats(
            per_groups=[
                TimeEventInDayBlockStatsPerGroup(
                    date=date, entity_tag=entity_tag, cnt=cnt
                )
                for (date, entity_tag), cnt in counts.items()
            ]
        )

    async def build_stats(
        self,
        uow: DomainUnitOfWork,
        schedule: schedules.Schedule,
        stats_subperiod: RecurringTaskPeriod,
        time_event_domain: TimeEventDomain,
        *,
        crown_entity_reader: CrownEntityReader,
        schedule_domain: ScheduleDomain | None = None,
        schedule_stream_ref_id: EntityId | None = None,
        time_events_full_days: list[TimeEventFullDaysBlock] | None = None,
        time_events_in_day: list[TimeEventInDayBlock] | None = None,
    ) -> CalendarEventsStats:
        """Build calendar stats for the schedule period."""
        if schedule_stream_ref_id is not None:
            if schedule_domain is None:
                raise InputValidationError(
                    "schedule_domain is required when filtering by schedule stream."
                )
            return await self._build_stats_for_schedule_stream(
                uow,
                schedule,
                stats_subperiod,
                time_event_domain,
                schedule_domain,
                schedule_stream_ref_id,
                crown_entity_reader,
            )

        if time_events_full_days is not None and time_events_in_day is not None:
            # Reuse rows already fetched for entries instead of re-querying the
            # same table for the same window. The in-day rows were fetched with
            # a wider lookback (to catch events spanning into the window), so
            # narrow back down to stats_for_all_between's exact bounds.
            full_days_raw_stats = self._stats_from_full_days_time_events(
                time_events_full_days
            )
            in_day_raw_stats = self._stats_from_in_day_time_events(
                [te for te in time_events_in_day if te.start_date >= schedule.first_day]
            )
        else:
            full_days_raw_stats = await uow.get(
                TimeEventFullDaysBlockRepository
            ).stats_for_all_between(
                parent_ref_id=time_event_domain.ref_id,
                start_date=schedule.first_day,
                end_date=schedule.end_day,
            )
            in_day_raw_stats = await uow.get(
                TimeEventInDayBlockRepository
            ).stats_for_all_between(
                parent_ref_id=time_event_domain.ref_id,
                start_date=schedule.first_day,
                end_date=schedule.end_day,
            )

        per_subperiod = []
        curr_day = schedule.first_day
        while curr_day <= schedule.end_day:
            subschedule = schedules.get_schedule(
                period=stats_subperiod,
                right_now=curr_day.to_timestamp_at_start_of_day(),
                name=NOT_USED_NAME,
            )

            schedule_event_full_days_cnt = 0
            schedule_event_in_day_cnt = 0
            big_plan_cnt = 0
            todo_task_cnt = 0
            habit_cnt = 0
            chore_cnt = 0
            time_plan_activity_cnt = 0
            person_birthday_cnt = 0
            vacation_cnt = 0

            # This is O(N*M) with a rather small M, so it's fine. Probably faster due to memory locality boosts.
            for full_days_stats in full_days_raw_stats.per_groups:
                if (
                    full_days_stats.date >= subschedule.first_day
                    and full_days_stats.date <= subschedule.end_day
                ):
                    if (
                        full_days_stats.entity_tag
                        == NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
                    ):
                        schedule_event_full_days_cnt += full_days_stats.cnt
                    elif full_days_stats.entity_tag == NamedEntityTag.OCCASION.value:
                        person_birthday_cnt += full_days_stats.cnt
                    elif full_days_stats.entity_tag == NamedEntityTag.VACATION.value:
                        vacation_cnt += full_days_stats.cnt
            for in_day_stats in in_day_raw_stats.per_groups:
                if (
                    in_day_stats.date >= subschedule.first_day
                    and in_day_stats.date <= subschedule.end_day
                ):
                    if (
                        in_day_stats.entity_tag
                        == NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value
                    ):
                        schedule_event_in_day_cnt += in_day_stats.cnt
                    elif in_day_stats.entity_tag == NamedEntityTag.BIG_PLAN.value:
                        big_plan_cnt += in_day_stats.cnt
                    elif in_day_stats.entity_tag == NamedEntityTag.TODO_TASK.value:
                        todo_task_cnt += in_day_stats.cnt
                    elif in_day_stats.entity_tag == NamedEntityTag.HABIT.value:
                        habit_cnt += in_day_stats.cnt
                    elif in_day_stats.entity_tag == NamedEntityTag.CHORE.value:
                        chore_cnt += in_day_stats.cnt
                    elif (
                        in_day_stats.entity_tag
                        == NamedEntityTag.TIME_PLAN_ACTIVITY.value
                    ):
                        time_plan_activity_cnt += in_day_stats.cnt

            per_subperiod.append(
                CalendarEventsStatsPerSubperiod(
                    period=stats_subperiod,
                    period_start_date=curr_day,
                    schedule_event_full_days_cnt=schedule_event_full_days_cnt,
                    schedule_event_in_day_cnt=schedule_event_in_day_cnt,
                    big_plan_cnt=big_plan_cnt,
                    todo_task_cnt=todo_task_cnt,
                    habit_cnt=habit_cnt,
                    chore_cnt=chore_cnt,
                    time_plan_activity_cnt=time_plan_activity_cnt,
                    person_birthday_cnt=person_birthday_cnt,
                    vacation_cnt=vacation_cnt,
                )
            )

            curr_day = subschedule.end_day.add_days(1)

        stats: CalendarEventsStats = CalendarEventsStats(
            subperiod=stats_subperiod,
            per_subperiod=per_subperiod,
        )

        return stats

    async def _build_stats_for_schedule_stream(
        self,
        uow: DomainUnitOfWork,
        schedule: schedules.Schedule,
        stats_subperiod: RecurringTaskPeriod,
        time_event_domain: TimeEventDomain,
        schedule_domain: ScheduleDomain,
        schedule_stream_ref_id: EntityId,
        crown_entity_reader: CrownEntityReader,
    ) -> CalendarEventsStats:
        time_events_full_days: list[TimeEventFullDaysBlock] = await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_all_between(
            parent_ref_id=time_event_domain.ref_id,
            start_date=schedule.first_day,
            end_date=schedule.end_day,
        )
        time_events_in_day: list[TimeEventInDayBlock] = await uow.get(
            TimeEventInDayBlockRepository
        ).find_all_between(
            parent_ref_id=time_event_domain.ref_id,
            start_date=schedule.first_day.subtract_days(2),
            end_date=schedule.end_day,
        )

        time_events_full_days_for_schedule_events: dict[
            EntityId, TimeEventFullDaysBlock
        ] = {
            te.owner.ref_id: te
            for te in time_events_full_days
            if te.owner.the_type == NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value
        }
        stream_full_days_time_events: list[TimeEventFullDaysBlock] = []
        if len(time_events_full_days_for_schedule_events) > 0:
            schedule_events_full_days = await crown_entity_reader.load_all_entities(
                ScheduleEventFullDays,
                list(time_events_full_days_for_schedule_events.keys()),
                allow_archived=False,
            )
            stream_full_days_time_events = [
                time_events_full_days_for_schedule_events[se.ref_id]
                for se in schedule_events_full_days
                if se.schedule_stream_ref_id == schedule_stream_ref_id
                and se.ref_id in time_events_full_days_for_schedule_events
            ]

        time_events_in_day_for_schedule_events = (
            _time_events_in_day_for_owner_type_unique(
                time_events_in_day,
                NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            )
        )
        stream_in_day_time_events: list[TimeEventInDayBlock] = []
        if len(time_events_in_day_for_schedule_events) > 0:
            schedule_events_in_day = await crown_entity_reader.load_all_entities(
                ScheduleEventInDay,
                list(time_events_in_day_for_schedule_events.keys()),
                allow_archived=False,
            )
            stream_in_day_time_events = [
                time_events_in_day_for_schedule_events[se.ref_id]
                for se in schedule_events_in_day
                if se.schedule_stream_ref_id == schedule_stream_ref_id
                and se.ref_id in time_events_in_day_for_schedule_events
            ]

        per_subperiod = []
        curr_day = schedule.first_day
        while curr_day <= schedule.end_day:
            subschedule = schedules.get_schedule(
                period=stats_subperiod,
                right_now=curr_day.to_timestamp_at_start_of_day(),
                name=NOT_USED_NAME,
            )

            schedule_event_in_day_cnt = sum(
                1
                for te in stream_in_day_time_events
                if te.start_date >= subschedule.first_day
                and te.start_date <= subschedule.end_day
            )
            schedule_event_full_days_cnt = sum(
                1
                for te in stream_full_days_time_events
                if te.start_date <= subschedule.end_day
                and te.end_date >= subschedule.first_day
            )

            per_subperiod.append(
                CalendarEventsStatsPerSubperiod(
                    period=stats_subperiod,
                    period_start_date=curr_day,
                    schedule_event_full_days_cnt=schedule_event_full_days_cnt,
                    schedule_event_in_day_cnt=schedule_event_in_day_cnt,
                    big_plan_cnt=0,
                    todo_task_cnt=0,
                    habit_cnt=0,
                    chore_cnt=0,
                    time_plan_activity_cnt=0,
                    person_birthday_cnt=0,
                    vacation_cnt=0,
                )
            )

            curr_day = subschedule.end_day.add_days(1)

        return CalendarEventsStats(
            subperiod=stats_subperiod,
            per_subperiod=per_subperiod,
        )
