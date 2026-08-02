"""The PostgreSQL implementation of the fast info repository."""

import json
from typing import cast

from jupiter.core.application.fast_info_repository import (
    AspectSummary,
    BigPlanSummary,
    ChapterSummary,
    ChoreSummary,
    FastInfoRepository,
    GoalSummary,
    HabitSummary,
    InboxTaskSummary,
    JournalSummary,
    MetricSummary,
    MilestoneSummary,
    PersonSummary,
    ScheduleStreamSummary,
    SmartListSummary,
    TodoTaskSummary,
    VacationSummary,
)
from jupiter.core.big_plans.name import BigPlanName
from jupiter.core.chores.name import ChoreName
from jupiter.core.common.entity_icon import EntityIconDatabaseDecoder
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.inbox_tasks.name import InboxTaskName
from jupiter.core.habits.name import HabitName
from jupiter.core.life_plan.partial_date import PartialDateDatabaseDecoder
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.chapters.name import ChapterName
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.metrics.name import MetricName
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.source import ScheduleStreamSource
from jupiter.core.smart_lists.name import SmartListName
from jupiter.core.todo.name import TodoTaskName
from jupiter.core.vacations.name import VacationName
from jupiter.framework.base.adate import ADate, ADateDatabaseDecoder
from jupiter.framework.base.entity_id import EntityId, EntityIdDatabaseDecoder
from jupiter.framework.base.entity_name import EntityNameDatabaseDecoder
from jupiter.framework.realm.realm import RealmThing
from jupiter.framework.storage.postgres.repository import PostgresRepository
from sqlalchemy import text

_ENTITY_ID_DECODER = EntityIdDatabaseDecoder()
_SCHEDULE_STREAM_NAME_DECODER = EntityNameDatabaseDecoder(ScheduleStreamName)
_VACATION_NAME_DECODER = EntityNameDatabaseDecoder(VacationName)
_INBOX_TASK_NAME_DECODER = EntityNameDatabaseDecoder(InboxTaskName)
_TODO_TASK_NAME_DECODER = EntityNameDatabaseDecoder(TodoTaskName)
_ASPECT_NAME_DECODER = EntityNameDatabaseDecoder(AspectName)
_CHAPTER_NAME_DECODER = EntityNameDatabaseDecoder(ChapterName)
_GOAL_NAME_DECODER = EntityNameDatabaseDecoder(GoalName)
_MILESTONE_NAME_DECODER = EntityNameDatabaseDecoder(MilestoneName)
_PARTIAL_DATE_DECODER = PartialDateDatabaseDecoder()
_ADATE_DECODER = ADateDatabaseDecoder()
_HABIT_NAME_DECODER = EntityNameDatabaseDecoder(HabitName)
_CHORE_NAME_DECODER = EntityNameDatabaseDecoder(ChoreName)
_BIG_PLAN_NAME_DECODER = EntityNameDatabaseDecoder(BigPlanName)
_SMART_LIST_NAME_DECODER = EntityNameDatabaseDecoder(SmartListName)
_METRIC_NAME_DECODER = EntityNameDatabaseDecoder(MetricName)
_PERSON_NAME_DECODER = EntityNameDatabaseDecoder(ContactName)
_ENTITY_ICON_DECODER = EntityIconDatabaseDecoder()


def _db_json_list(value: object) -> list[RealmThing]:
    """Decode a JSON array column: str/bytes (typical) or list (JSONB from asyncpg)."""
    if isinstance(value, list):
        return value
    if isinstance(value, (str, bytes, bytearray)):
        return cast(list[RealmThing], json.loads(value))
    if value is None:
        return []
    raise TypeError(
        f"expected JSON array as list, str, or None, got {type(value).__name__}"
    )


class PostgresFastInfoRepository(PostgresRepository, FastInfoRepository):
    """The Postgres based implementation for the fast info repository."""

    async def find_all_vacation_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[VacationSummary]:
        """Find all accessible summaries about vacations."""
        query = """
            select vacation.ref_id, vacation.name
            from vacation
            join access_status on
                access_status.entity = 'Vacation:std:' || vacation.ref_id
                and access_status.user_ref_id = :user_ref_id
            where vacation.vacation_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and vacation.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            VacationSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_VACATION_NAME_DECODER.decode(row["name"]),
            )
            for row in result
        ]

    async def find_all_schedule_stream_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ScheduleStreamSummary]:
        """Find all accessible summaries about schedule streams."""
        query = """
            select schedule_stream.ref_id, schedule_stream.source, schedule_stream.name, schedule_stream.color
            from schedule_stream
            join access_status on
                access_status.entity = 'ScheduleStream:std:' || schedule_stream.ref_id
                and access_status.user_ref_id = :user_ref_id
            where schedule_stream.schedule_domain_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and schedule_stream.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            ScheduleStreamSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                source=self._realm_codec_registry.db_decode(
                    ScheduleStreamSource, row["source"]
                ),
                name=_SCHEDULE_STREAM_NAME_DECODER.decode(row["name"]),
                color=self._realm_codec_registry.db_decode(
                    ScheduleStreamColor, row["color"]
                ),
            )
            for row in result
        ]

    async def find_all_aspect_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[AspectSummary]:
        """Find all accessible summaries about aspects."""
        query = """
            select aspect.ref_id, aspect.parent_aspect_ref_id, aspect.name, aspect.order_of_child_aspects
            from aspect
            join access_status on
                access_status.entity = 'Aspect:std:' || aspect.ref_id
                and access_status.user_ref_id = :user_ref_id
            where aspect.life_plan_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and aspect.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            AspectSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                parent_aspect_ref_id=(
                    _ENTITY_ID_DECODER.decode(str(row["parent_aspect_ref_id"]))
                    if row["parent_aspect_ref_id"]
                    else None
                ),
                name=_ASPECT_NAME_DECODER.decode(row["name"]),
                order_of_child_aspects=[
                    _ENTITY_ID_DECODER.decode(idx)
                    for idx in _db_json_list(row["order_of_child_aspects"])
                ],
            )
            for row in result
        ]

    async def find_all_chapter_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChapterSummary]:
        """Find all accessible summaries about chapters."""
        query = """
            select chapter.ref_id, chapter.name, chapter.start_date, chapter.end_date, chapter.aspect_ref_id
            from chapter
            join access_status on
                access_status.entity = 'Chapter:std:' || chapter.ref_id
                and access_status.user_ref_id = :user_ref_id
            where chapter.life_plan_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and chapter.archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            ChapterSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_CHAPTER_NAME_DECODER.decode(row["name"]),
                start_date=_PARTIAL_DATE_DECODER.decode(row["start_date"]),
                end_date=_PARTIAL_DATE_DECODER.decode(row["end_date"]),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
            )
            for row in result
        ]

    async def find_all_milestone_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[MilestoneSummary]:
        """Find all accessible summaries about milestones."""
        query = """
            select milestone.ref_id, milestone.name, milestone.date, milestone.aspect_ref_id
            from milestone
            join access_status on
                access_status.entity = 'Milestone:std:' || milestone.ref_id
                and access_status.user_ref_id = :user_ref_id
            where milestone.life_plan_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and milestone.archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            MilestoneSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_MILESTONE_NAME_DECODER.decode(row["name"]),
                date=_ADATE_DECODER.decode(row["date"]),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
            )
            for row in result
        ]

    async def find_all_goal_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[GoalSummary]:
        """Find all accessible summaries about goals."""
        query = """
            select goal.ref_id, goal.name, goal.aspect_ref_id, goal.parent_goal_ref_id
            from goal
            join access_status on
                access_status.entity = 'Goal:std:' || goal.ref_id
                and access_status.user_ref_id = :user_ref_id
            where goal.life_plan_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and goal.archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            GoalSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_GOAL_NAME_DECODER.decode(row["name"]),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
                parent_goal_ref_id=(
                    _ENTITY_ID_DECODER.decode(str(row["parent_goal_ref_id"]))
                    if row["parent_goal_ref_id"]
                    else None
                ),
            )
            for row in result
        ]

    async def find_all_inbox_task_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[InboxTaskSummary]:
        """Find all accessible summaries about inbox tasks."""
        query = """
            select inbox_task.ref_id, inbox_task.name
            from inbox_task
            join access_status on
                access_status.entity = 'InboxTask:std:' || inbox_task.ref_id
                and access_status.user_ref_id = :user_ref_id
            where inbox_task.inbox_task_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and inbox_task.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            InboxTaskSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_INBOX_TASK_NAME_DECODER.decode(row["name"]),
            )
            for row in result
        ]

    async def find_all_todo_task_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[TodoTaskSummary]:
        """Find all accessible summaries about todo tasks."""
        query = """
            select todo_task.ref_id, todo_task.name, todo_task.aspect_ref_id, todo_task.chapter_ref_id, todo_task.goal_ref_id
            from todo_task
            join access_status on
                access_status.entity = 'TodoTask:std:' || todo_task.ref_id
                and access_status.user_ref_id = :user_ref_id
            where todo_task.todo_domain_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and todo_task.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            TodoTaskSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_TODO_TASK_NAME_DECODER.decode(row["name"]),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
                chapter_ref_id=(
                    _ENTITY_ID_DECODER.decode(str(row["chapter_ref_id"]))
                    if row["chapter_ref_id"] is not None
                    else None
                ),
                goal_ref_id=(
                    _ENTITY_ID_DECODER.decode(str(row["goal_ref_id"]))
                    if row["goal_ref_id"] is not None
                    else None
                ),
            )
            for row in result
        ]

    async def find_all_journal_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
        filter_start_date: ADate,
        filter_end_date: ADate,
    ) -> list[JournalSummary]:
        """Find all accessible summaries about journals."""
        query = """
            select journal.ref_id, journal.name
            from journal
            join access_status on
                access_status.entity = 'Journal:std:' || journal.ref_id
                and access_status.user_ref_id = :user_ref_id
            where journal.journal_collection_ref_id = :parent_ref_id
              and journal.right_now >= :filter_start_date
              and journal.right_now <= :filter_end_date
        """
        if not allow_archived:
            query += " and journal.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                        "filter_start_date": filter_start_date.the_date.to_date_string(),
                        "filter_end_date": filter_end_date.the_date.to_date_string(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            JournalSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_INBOX_TASK_NAME_DECODER.decode(row["name"]),
            )
            for row in result
        ]

    async def find_all_habit_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[HabitSummary]:
        """Find all accessible summaries about habits."""
        query = """
            select
                habit.ref_id,
                habit.name,
                habit.is_key,
                habit.gen_params,
                habit.aspect_ref_id
            from habit
            join access_status on
                access_status.entity = 'Habit:std:' || habit.ref_id
                and access_status.user_ref_id = :user_ref_id
            where habit.habit_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and habit.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            HabitSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_HABIT_NAME_DECODER.decode(row["name"]),
                is_key=row["is_key"],
                period=self._realm_codec_registry.db_decode(
                    RecurringTaskGenParams,
                    row["gen_params"],
                ).period,
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
            )
            for row in result
        ]

    async def find_all_chore_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChoreSummary]:
        """Find all accessible summaries about chores."""
        query = """
            select chore.ref_id, chore.name
            from chore
            join access_status on
                access_status.entity = 'Chore:std:' || chore.ref_id
                and access_status.user_ref_id = :user_ref_id
            where chore.chore_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and chore.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            ChoreSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_CHORE_NAME_DECODER.decode(row["name"]),
            )
            for row in result
        ]

    async def find_all_big_plan_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[BigPlanSummary]:
        """Find all accessible summaries about big plans."""
        query = """
            select big_plan.ref_id, big_plan.name, big_plan.aspect_ref_id, big_plan.chapter_ref_id, big_plan.goal_ref_id, big_plan.is_key
            from big_plan
            join access_status on
                access_status.entity = 'BigPlan:std:' || big_plan.ref_id
                and access_status.user_ref_id = :user_ref_id
            where big_plan.big_plan_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and big_plan.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            BigPlanSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_BIG_PLAN_NAME_DECODER.decode(row["name"]),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
                chapter_ref_id=_ENTITY_ID_DECODER.decode(str(row["chapter_ref_id"])),
                goal_ref_id=_ENTITY_ID_DECODER.decode(str(row["goal_ref_id"])),
                is_key=row["is_key"],
            )
            for row in result
        ]

    async def find_all_smart_list_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[SmartListSummary]:
        """Find all accessible summaries about smart lists."""
        query = """
            select smart_list.ref_id, smart_list.name, smart_list.icon
            from smart_list
            join access_status on
                access_status.entity = 'SmartList:std:' || smart_list.ref_id
                and access_status.user_ref_id = :user_ref_id
            where smart_list.smart_list_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and smart_list.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            SmartListSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_SMART_LIST_NAME_DECODER.decode(row["name"]),
                icon=_ENTITY_ICON_DECODER.decode(row["icon"]) if row["icon"] else None,
            )
            for row in result
        ]

    async def find_all_metric_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[MetricSummary]:
        """Find all accessible summaries about metrics."""
        query = """
            select metric.ref_id, metric.name, metric.is_key, metric.icon
            from metric
            join access_status on
                access_status.entity = 'Metric:std:' || metric.ref_id
                and access_status.user_ref_id = :user_ref_id
            where metric.metric_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and metric.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            MetricSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_METRIC_NAME_DECODER.decode(row["name"]),
                is_key=row["is_key"],
                icon=_ENTITY_ICON_DECODER.decode(row["icon"]) if row["icon"] else None,
            )
            for row in result
        ]

    async def find_all_person_summaries(
        self,
        parent_ref_id: EntityId,
        user_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[PersonSummary]:
        """Find all accessible summaries about persons."""
        query = """
            select
                person.ref_id as ref_id,
                contact.name as name
            from person
            join access_status on
                access_status.entity = 'Person:std:' || person.ref_id
                and access_status.user_ref_id = :user_ref_id
            join prm on person.prm_ref_id = prm.ref_id
            join contact_domain on contact_domain.workspace_ref_id = prm.workspace_ref_id
            join contact_link on
                contact_link.contact_domain_ref_id = contact_domain.ref_id
                and contact_link.owner = 'Person:std:' || person.ref_id
            join contact on
                contact.contact_domain_ref_id = contact_domain.ref_id
                and contact.ref_id = (contact_link.contacts_ref_ids #>> '{0}')::integer
            where person.prm_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and person.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
                        "user_ref_id": user_ref_id.as_int(),
                    },
                )
            )
            .mappings()
            .all()
        )
        return [
            PersonSummary(
                ref_id=_ENTITY_ID_DECODER.decode(str(row["ref_id"])),
                name=_PERSON_NAME_DECODER.decode(row["name"]),
            )
            for row in result
        ]
