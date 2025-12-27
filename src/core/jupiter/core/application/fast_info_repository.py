"""A query-like repository for scanning information quickly about entities."""

import abc

from jupiter.core.big_plans.name import BigPlanName
from jupiter.core.chores.name import ChoreName
from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.habits.name import HabitName
from jupiter.core.inbox_tasks.name import InboxTaskName
from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.sub.aspects.name import ProjectName
from jupiter.core.life_plan.sub.chapters.name import ChapterName
from jupiter.core.life_plan.sub.goals.name import GoalName
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.metrics.name import MetricName
from jupiter.core.persons.name import PersonName
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.source import ScheduleStreamSource
from jupiter.core.smart_lists.name import SmartListName
from jupiter.core.vacations.name import VacationName
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.storage.repository import Repository
from jupiter.framework.value import CompositeValue, value


@value
class VacationSummary(CompositeValue):
    """Summary information about a vacation."""

    ref_id: EntityId
    name: VacationName


@value
class ScheduleStreamSummary(CompositeValue):
    """Summary information about a schedule stream."""

    ref_id: EntityId
    source: ScheduleStreamSource
    name: ScheduleStreamName
    color: ScheduleStreamColor


@value
class ProjectSummary(CompositeValue):
    """Summary information about a project."""

    ref_id: EntityId
    parent_project_ref_id: EntityId | None
    name: ProjectName
    order_of_child_projects: list[EntityId]


@value
class ChapterSummary(CompositeValue):
    """Summary information about a chapter."""

    ref_id: EntityId
    name: ChapterName
    start_date: PartialDate
    end_date: PartialDate
    project_ref_id: EntityId


@value
class MilestoneSummary(CompositeValue):
    """Summary information about a milestone."""

    ref_id: EntityId
    name: MilestoneName
    date: ADate
    project_ref_id: EntityId


@value
class GoalSummary(CompositeValue):
    """Summary information about a goal."""

    ref_id: EntityId
    name: GoalName
    project_ref_id: EntityId


@value
class InboxTaskSummary(CompositeValue):
    """Summary information about an inbox task."""

    ref_id: EntityId
    name: InboxTaskName


@value
class JournalSummary(CompositeValue):
    """Summary information about a journal."""

    ref_id: EntityId
    name: EntityName


@value
class HabitSummary(CompositeValue):
    """Summary information about a habit."""

    ref_id: EntityId
    name: HabitName
    is_key: bool
    period: RecurringTaskPeriod
    project_ref_id: EntityId


@value
class ChoreSummary(CompositeValue):
    """Summary information about a chore."""

    ref_id: EntityId
    name: ChoreName


@value
class BigPlanSummary(CompositeValue):
    """Summary information about a big plan."""

    ref_id: EntityId
    name: BigPlanName
    project_ref_id: EntityId
    is_key: bool


@value
class SmartListSummary(CompositeValue):
    """Summary information about a smart list."""

    ref_id: EntityId
    name: SmartListName
    icon: EntityIcon | None


@value
class MetricSummary(CompositeValue):
    """Summary information about a metric."""

    ref_id: EntityId
    name: MetricName
    is_key: bool
    icon: EntityIcon | None


@value
class PersonSummary(CompositeValue):
    """Summary information about a person."""

    ref_id: EntityId
    name: PersonName


class FastInfoRepository(Repository, abc.ABC):
    """A query-like repository for scanning information quickly about entities."""

    @abc.abstractmethod
    async def find_all_vacation_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[VacationSummary]:
        """Find all summaries about vacations."""

    @abc.abstractmethod
    async def find_all_schedule_stream_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ScheduleStreamSummary]:
        """Find all summaries about schedule streams."""

    @abc.abstractmethod
    async def find_all_project_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ProjectSummary]:
        """Find all summaries about projects."""

    @abc.abstractmethod
    async def find_all_chapter_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChapterSummary]:
        """Find all summaries about chapters."""

    @abc.abstractmethod
    async def find_all_milestone_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[MilestoneSummary]:
        """Find all summaries about milestones."""

    @abc.abstractmethod
    async def find_all_goal_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[GoalSummary]:
        """Find all summaries about goals."""

    @abc.abstractmethod
    async def find_all_inbox_task_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[InboxTaskSummary]:
        """Find all summaries about inbox tasks."""

    @abc.abstractmethod
    async def find_all_journal_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
        filter_start_date: ADate,
        filter_end_date: ADate,
    ) -> list[JournalSummary]:
        """Find all summaries about journals."""

    @abc.abstractmethod
    async def find_all_habit_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[HabitSummary]:
        """Find all summaries about habits."""

    @abc.abstractmethod
    async def find_all_chore_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[ChoreSummary]:
        """Find all summaries about chores."""

    @abc.abstractmethod
    async def find_all_big_plan_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[BigPlanSummary]:
        """Find all summaries about big plans."""

    @abc.abstractmethod
    async def find_all_smart_list_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[SmartListSummary]:
        """Find all summaries about smart lists."""

    @abc.abstractmethod
    async def find_all_metric_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[MetricSummary]:
        """Find all summaries about metrics."""

    @abc.abstractmethod
    async def find_all_person_summaries(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool,
    ) -> list[PersonSummary]:
        """Find all summaries about persons."""
