"""The PostgreSQL implementation of the fast info repository."""

import json

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
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
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


class PostgresFastInfoRepository(PostgresRepository, FastInfoRepository):
    """The Postgres based implementation for the fast info repository."""

    async def find_all_vacation_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[VacationSummary]:
        """Find all summaries about vacations."""
        query = """select ref_id, name from vacation where vacation_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[ScheduleStreamSummary]:
        """Find all summaries about schedule streams."""
        query = """select ref_id, source, name, color from schedule_stream where schedule_domain_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[AspectSummary]:
        """Find all summaries about aspects."""
        query = """select ref_id, parent_aspect_ref_id, name, order_of_child_aspects from aspect where life_plan_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
                    for idx in json.loads(row["order_of_child_aspects"])
                ],
            )
            for row in result
        ]

    async def find_all_chapter_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChapterSummary]:
        """Find all summaries about chapters."""
        query = """select ref_id, name, start_date, end_date, aspect_ref_id from chapter where life_plan_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[MilestoneSummary]:
        """Find all summaries about milestones."""
        query = """select ref_id, name, date, aspect_ref_id from milestone where life_plan_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[GoalSummary]:
        """Find all summaries about goals."""
        query = """select ref_id, name, aspect_ref_id, parent_goal_ref_id from goal where life_plan_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"

        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[InboxTaskSummary]:
        """Find all summaries about inbox tasks."""
        query = """select ref_id, name from inbox_task where inbox_task_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[TodoTaskSummary]:
        """Find all summaries about todo tasks."""
        query = """select ref_id, name, aspect_ref_id, chapter_ref_id, goal_ref_id from todo_task where todo_domain_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
        filter_start_date: ADate,
        filter_end_date: ADate,
    ) -> list[JournalSummary]:
        """Find all summaries about journals."""
        query = """select ref_id, name from journal where journal_collection_ref_id = :parent_ref_id and right_now >= :filter_start_date and right_now <= :filter_end_date"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query),
                    {
                        "parent_ref_id": parent_ref_id.as_int(),
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
        allow_archived: bool,
    ) -> list[HabitSummary]:
        """Find all summaries about habits."""
        query = """
            select
                ref_id,
                name,
                is_key,
                json_extract(gen_params, '$.period') as period,
                aspect_ref_id
            from habit
            where habit_collection_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
                    RecurringTaskPeriod, row["period"]
                ),
                aspect_ref_id=_ENTITY_ID_DECODER.decode(str(row["aspect_ref_id"])),
            )
            for row in result
        ]

    async def find_all_chore_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChoreSummary]:
        """Find all summaries about chores."""
        query = """select ref_id, name from chore where chore_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[BigPlanSummary]:
        """Find all summaries about big plans."""
        query = """select ref_id, name, aspect_ref_id, chapter_ref_id, goal_ref_id, is_key from big_plan where big_plan_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[SmartListSummary]:
        """Find all summaries about smart lists."""
        query = """select ref_id, name, icon from smart_list where smart_list_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[MetricSummary]:
        """Find all summaries about metrics."""
        query = """select ref_id, name, is_key, icon from metric where metric_collection_ref_id = :parent_ref_id"""
        if not allow_archived:
            query += " and archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
        allow_archived: bool,
    ) -> list[PersonSummary]:
        """Find all summaries about persons."""
        query = """
            select
                person.ref_id as ref_id,
                contact.name as name
            from person
            join prm on person.prm_ref_id = prm.ref_id
            join contact_domain on contact_domain.workspace_ref_id = prm.workspace_ref_id
            join contact_link on
                contact_link.contact_domain_ref_id = contact_domain.ref_id
                and contact_link.owner = 'Person:' || person.ref_id || ':' || 'std'
            join contact on
                contact.contact_domain_ref_id = contact_domain.ref_id
                and contact.ref_id = json_extract(contact_link.contacts_ref_ids, '$[0]')
            where person.prm_ref_id = :parent_ref_id
        """
        if not allow_archived:
            query += " and person.archived IS FALSE"
        result = (
            (
                await self._connection.execute(
                    text(query), {"parent_ref_id": parent_ref_id.as_int()}
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
