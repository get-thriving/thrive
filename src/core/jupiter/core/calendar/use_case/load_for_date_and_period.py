"""Load all the calendar specific entities for a given date and period."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
    TimeEventInDayBlockRepository,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.time_plans.sub.activity.target import TimePlanActivityTarget
from jupiter.core.todo.domain import TodoDomain
from jupiter.core.todo.root import TodoTask
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.vacations.root import Vacation
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.errors import InputValidationError
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
        if args.stats_subperiod is not None:
            if args.period is RecurringTaskPeriod.DAILY:
                raise InputValidationError(
                    "Stats subperiod is not allowed for daily period."
                )
            elif args.stats_subperiod not in args.period.all_smaller_periods:
                raise InputValidationError(
                    f"Stats subperiod {args.stats_subperiod} is not smaller than period {args.period}."
                )

        workspace = context.workspace
        schedule = schedules.get_schedule(
            period=args.period,
            right_now=args.right_now.to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )
        prev_schedule = schedules.get_schedule(
            period=args.period,
            right_now=schedule.first_day.subtract_days(
                1
            ).to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )
        next_schedule = schedules.get_schedule(
            period=args.period,
            right_now=schedule.end_day.add_days(1).to_timestamp_at_start_of_day(),
            name=NOT_USED_NAME,
        )

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

        entries: CalendarEventsEntries | None = None
        if (
            args.period is RecurringTaskPeriod.DAILY
            or args.period is RecurringTaskPeriod.WEEKLY
        ):
            entries = await self._build_entries(
                uow,
                workspace,
                schedule,
                time_event_domain,
                schedule_domain,
                schedule_streams_by_ref_id,
            )

        stats: CalendarEventsStats | None = None
        if (
            schedule.period != RecurringTaskPeriod.DAILY
            and args.stats_subperiod is not None
        ):
            stats = await self._build_stats(
                uow, schedule, args.stats_subperiod, time_event_domain
            )

        return CalendarLoadForDateAndPeriodResult(
            right_now=args.right_now,
            period=args.period,
            stats_subperiod=args.stats_subperiod,
            period_start_date=schedule.first_day,
            period_end_date=schedule.end_day,
            prev_period_start_date=prev_schedule.first_day,
            next_period_start_date=next_schedule.first_day,
            entries=entries,
            stats=stats,
        )

    async def _build_entries(
        self,
        uow: DomainUnitOfWork,
        workspace: Workspace,
        schedule: schedules.Schedule,
        time_event_domain: TimeEventDomain,
        schedule_domain: ScheduleDomain,
        schedule_streams_by_ref_id: dict[EntityId, ScheduleStream],
    ) -> CalendarEventsEntries:
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

        time_events_full_days_for_schedule_events_full_days: dict[
            EntityId, TimeEventFullDaysBlock
        ] = {
            te.source_entity_ref_id: te
            for te in time_events_full_days
            if te.namespace == TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK
        }
        schedule_events_full_days = []
        if len(time_events_full_days_for_schedule_events_full_days) > 0:
            schedule_events_full_days = await uow.get_for(
                ScheduleEventFullDays
            ).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                allow_archived=False,
                ref_id=list(time_events_full_days_for_schedule_events_full_days.keys()),
            )

        tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)

        full_days_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
        if schedule_events_full_days:
            all_full_days_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
            )
            all_full_days_tags_by_ref_id = {t.ref_id: t for t in all_full_days_tags}
            full_days_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SCHEDULE_EVENT_FULL_DAYS_BLOCK,
                source_entity_ref_id=[se.ref_id for se in schedule_events_full_days],
            )
            for tag_link in full_days_tag_links:
                full_days_tags_by_schedule_event_ref_id[
                    tag_link.source_entity_ref_id
                ] = [
                    all_full_days_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_full_days_tags_by_ref_id
                ]

        schedule_event_full_days_entries = [
            ScheduleFullDaysEventEntry(
                event=se,
                tags=full_days_tags_by_schedule_event_ref_id.get(se.ref_id, []),
                time_event=time_events_full_days_for_schedule_events_full_days[
                    se.ref_id
                ],
                stream=schedule_streams_by_ref_id[se.schedule_stream_ref_id],
            )
            for se in schedule_events_full_days
        ]

        time_events_in_day_for_schedule_events_in_day: dict[
            EntityId, TimeEventInDayBlock
        ] = {
            te.source_entity_ref_id: te
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.SCHEDULE_EVENT_IN_DAY
        }
        schedule_events_in_day = []
        if len(time_events_in_day_for_schedule_events_in_day) > 0:
            schedule_events_in_day = await uow.get_for(
                ScheduleEventInDay
            ).find_all_generic(
                parent_ref_id=schedule_domain.ref_id,
                allow_archived=False,
                ref_id=list(time_events_in_day_for_schedule_events_in_day.keys()),
            )

        in_day_tags_by_schedule_event_ref_id: dict[EntityId, list[Tag]] = {}
        if schedule_events_in_day:
            all_in_day_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SCHEDULE_EVENT_IN_DAY,
            )
            all_in_day_tags_by_ref_id = {t.ref_id: t for t in all_in_day_tags}
            in_day_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SCHEDULE_EVENT_IN_DAY,
                source_entity_ref_id=[se.ref_id for se in schedule_events_in_day],
            )
            for tag_link in in_day_tag_links:
                in_day_tags_by_schedule_event_ref_id[tag_link.source_entity_ref_id] = [
                    all_in_day_tags_by_ref_id[rid]
                    for rid in tag_link.ref_ids
                    if rid in all_in_day_tags_by_ref_id
                ]

        schedule_event_in_day_entries = [
            ScheduleInDayEventEntry(
                event=se,
                tags=in_day_tags_by_schedule_event_ref_id.get(se.ref_id, []),
                time_event=time_events_in_day_for_schedule_events_in_day[se.ref_id],
                stream=schedule_streams_by_ref_id[se.schedule_stream_ref_id],
            )
            for se in schedule_events_in_day
        ]

        time_events_in_day_for_big_plans: dict[EntityId, list[TimeEventInDayBlock]] = {
            te.source_entity_ref_id: []
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.BIG_PLAN
        }
        for te in time_events_in_day:
            if te.namespace == TimeEventNamespace.BIG_PLAN:
                time_events_in_day_for_big_plans[te.source_entity_ref_id].append(te)
        big_plans: list[BigPlan] = []
        if len(time_events_in_day_for_big_plans) > 0:
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id,
            )
            big_plans = await uow.get_for(BigPlan).find_all_generic(
                parent_ref_id=big_plan_collection.ref_id,
                allow_archived=JupiterArchivalReason.GC,
                ref_id=list(time_events_in_day_for_big_plans.keys()),
            )
        big_plan_entries = [
            BigPlanEntry(
                big_plan=big_plan,
                time_events=time_events_in_day_for_big_plans[big_plan.ref_id],
            )
            for big_plan in big_plans
        ]

        time_events_in_day_for_todo_tasks: dict[EntityId, list[TimeEventInDayBlock]] = {
            te.source_entity_ref_id: []
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.TODO_TASK
        }
        for te in time_events_in_day:
            if te.namespace == TimeEventNamespace.TODO_TASK:
                time_events_in_day_for_todo_tasks[te.source_entity_ref_id].append(te)
        todo_tasks: list[TodoTask] = []
        todo_task_inbox_tasks: dict[EntityId, InboxTask] = {}
        if len(time_events_in_day_for_todo_tasks) > 0:
            todo_domain = await uow.get_for(TodoDomain).load_by_parent(
                workspace.ref_id,
            )
            todo_tasks = await uow.get_for(TodoTask).find_all_generic(
                parent_ref_id=todo_domain.ref_id,
                allow_archived=JupiterArchivalReason.GC,
                ref_id=list(time_events_in_day_for_todo_tasks.keys()),
            )
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            linked_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_source_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                namespace=InboxTaskNamespace.TODO_TASK,
                source_entity_ref_id=[tt.ref_id for tt in todo_tasks],
                allow_archived=JupiterArchivalReason.GC,
            )
            for it in linked_inbox_tasks:
                if it.source_entity_ref_id not in todo_task_inbox_tasks:
                    todo_task_inbox_tasks[it.source_entity_ref_id] = it
        todo_task_entries = [
            TodoTaskEntry(
                todo_task=todo_task,
                inbox_task=todo_task_inbox_tasks[todo_task.ref_id],
                time_events=time_events_in_day_for_todo_tasks[todo_task.ref_id],
            )
            for todo_task in todo_tasks
            if todo_task.ref_id in todo_task_inbox_tasks
        ]

        time_events_in_day_for_habits: dict[EntityId, list[TimeEventInDayBlock]] = {
            te.source_entity_ref_id: []
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.HABIT
        }
        for te in time_events_in_day:
            if te.namespace == TimeEventNamespace.HABIT:
                time_events_in_day_for_habits[te.source_entity_ref_id].append(te)
        habits: list[Habit] = []
        if len(time_events_in_day_for_habits) > 0:
            habit_collection = await uow.get_for(HabitCollection).load_by_parent(
                workspace.ref_id,
            )
            habits = await uow.get_for(Habit).find_all_generic(
                parent_ref_id=habit_collection.ref_id,
                allow_archived=JupiterArchivalReason.GC,
                ref_id=list(time_events_in_day_for_habits.keys()),
            )
        habit_entries = [
            HabitEntry(
                habit=habit,
                time_events=time_events_in_day_for_habits[habit.ref_id],
            )
            for habit in habits
        ]

        time_events_in_day_for_chores: dict[EntityId, list[TimeEventInDayBlock]] = {
            te.source_entity_ref_id: []
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.CHORE
        }
        for te in time_events_in_day:
            if te.namespace == TimeEventNamespace.CHORE:
                time_events_in_day_for_chores[te.source_entity_ref_id].append(te)
        chores: list[Chore] = []
        if len(time_events_in_day_for_chores) > 0:
            chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
                workspace.ref_id,
            )
            chores = await uow.get_for(Chore).find_all_generic(
                parent_ref_id=chore_collection.ref_id,
                allow_archived=JupiterArchivalReason.GC,
                ref_id=list(time_events_in_day_for_chores.keys()),
            )
        chore_entries = [
            ChoreEntry(
                chore=chore,
                time_events=time_events_in_day_for_chores[chore.ref_id],
            )
            for chore in chores
        ]

        time_events_in_day_for_activities: dict[EntityId, list[TimeEventInDayBlock]] = {
            te.source_entity_ref_id: []
            for te in time_events_in_day
            if te.namespace == TimeEventNamespace.TIME_PLAN_ACTIVITY
        }
        for te in time_events_in_day:
            if te.namespace == TimeEventNamespace.TIME_PLAN_ACTIVITY:
                time_events_in_day_for_activities[te.source_entity_ref_id].append(te)
        time_plan_activities: list[TimePlanActivity] = []
        if len(time_events_in_day_for_activities) > 0:
            time_plan_activities = await uow.get_for(TimePlanActivity).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=list(time_events_in_day_for_activities.keys()),
            )

        activity_target_inbox_task_ref_ids = [
            a.target_ref_id
            for a in time_plan_activities
            if a.target == TimePlanActivityTarget.INBOX_TASK
        ]
        activity_target_inbox_tasks_by_id: dict[EntityId, InboxTask] = {}
        if activity_target_inbox_task_ref_ids:
            activity_target_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=activity_target_inbox_task_ref_ids,
            )
            activity_target_inbox_tasks_by_id = {
                it.ref_id: it for it in activity_target_inbox_tasks
            }

        activity_target_big_plan_ref_ids = [
            a.target_ref_id
            for a in time_plan_activities
            if a.target == TimePlanActivityTarget.BIG_PLAN
        ]
        activity_target_big_plans_by_id: dict[EntityId, BigPlan] = {}
        if activity_target_big_plan_ref_ids:
            activity_target_big_plans = await uow.get_for(BigPlan).find_all_generic(
                parent_ref_id=None,
                allow_archived=True,
                ref_id=activity_target_big_plan_ref_ids,
            )
            activity_target_big_plans_by_id = {
                bp.ref_id: bp for bp in activity_target_big_plans
            }

        time_plan_activity_entries = [
            TimePlanActivityEntry(
                time_plan_activity=activity,
                target_inbox_task=activity_target_inbox_tasks_by_id.get(
                    activity.target_ref_id
                ),
                target_big_plan=activity_target_big_plans_by_id.get(
                    activity.target_ref_id
                ),
                time_events=time_events_in_day_for_activities[activity.ref_id],
            )
            for activity in time_plan_activities
        ]

        time_events_full_days_for_occasions: dict[EntityId, TimeEventFullDaysBlock] = {
            te.source_entity_ref_id: te
            for te in time_events_full_days
            if te.namespace == TimeEventNamespace.PERSON_OCCASION
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
                namespace=ContactNamespace.PERSON,
                allow_archived=False,
            )
            for link in contact_links:
                contact_links_by_person[link.source_entity_ref_id] = link

        person_occasion_entries = []
        for occasion in occasions:
            person = persons_by_ref_id[occasion.person.ref_id]
            contact_link = contact_links_by_person.get(person.ref_id)
            if contact_link and contact_link.contacts_ref_ids:
                # Use the first contact associated with this person
                # In a real scenario, you might want a more sophisticated selection
                contact_ref_id = contact_link.contacts_ref_ids[0]
                contact = await uow.get_for(Contact).load_by_id(contact_ref_id)
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
            te.source_entity_ref_id: te
            for te in time_events_full_days
            if te.namespace == TimeEventNamespace.VACATION
        }
        vacations = []
        if len(time_event_full_days_for_vacations) > 0:
            vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
                workspace.ref_id,
            )
            vacations = await uow.get_for(Vacation).find_all_generic(
                parent_ref_id=vacation_collection.ref_id,
                allow_archived=False,
                ref_id=list(time_event_full_days_for_vacations.keys()),
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

    async def _build_stats(
        self,
        uow: DomainUnitOfWork,
        schedule: schedules.Schedule,
        stats_subperiod: RecurringTaskPeriod,
        time_event_domain: TimeEventDomain,
    ) -> CalendarEventsStats:
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
                        full_days_stats.namespace
                        == TimeEventNamespace.SCHEDULE_FULL_DAYS_BLOCK
                    ):
                        schedule_event_full_days_cnt += full_days_stats.cnt
                    elif (
                        full_days_stats.namespace == TimeEventNamespace.PERSON_OCCASION
                    ):
                        person_birthday_cnt += full_days_stats.cnt
                    elif full_days_stats.namespace == TimeEventNamespace.VACATION:
                        vacation_cnt += full_days_stats.cnt
            for in_day_stats in in_day_raw_stats.per_groups:
                if (
                    in_day_stats.date >= subschedule.first_day
                    and in_day_stats.date <= subschedule.end_day
                ):
                    if (
                        in_day_stats.namespace
                        == TimeEventNamespace.SCHEDULE_EVENT_IN_DAY
                    ):
                        schedule_event_in_day_cnt += in_day_stats.cnt
                    elif in_day_stats.namespace == TimeEventNamespace.BIG_PLAN:
                        big_plan_cnt += in_day_stats.cnt
                    elif in_day_stats.namespace == TimeEventNamespace.TODO_TASK:
                        todo_task_cnt += in_day_stats.cnt
                    elif in_day_stats.namespace == TimeEventNamespace.HABIT:
                        habit_cnt += in_day_stats.cnt
                    elif in_day_stats.namespace == TimeEventNamespace.CHORE:
                        chore_cnt += in_day_stats.cnt
                    elif (
                        in_day_stats.namespace == TimeEventNamespace.TIME_PLAN_ACTIVITY
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
