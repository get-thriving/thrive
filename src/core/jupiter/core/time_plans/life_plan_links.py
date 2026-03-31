"""Links between time plans and life plan entities (chapters, aspects/aspects, goals)."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, create_record_action, record
from jupiter.framework.storage.repository import (
    RecordRepository,
)


@record
class TimePlanAspectLink(Record):
    """A link between a time plan and a aspect (aka aspect)."""

    time_plan: ParentLink
    aspect_ref_id: EntityId

    @staticmethod
    @create_record_action
    def new_link(
        ctx: DomainContext, time_plan_ref_id: EntityId, aspect_ref_id: EntityId
    ) -> "TimePlanAspectLink":
        """Create a new link."""
        return TimePlanAspectLink._create(
            ctx,
            time_plan=ParentLink(time_plan_ref_id),
            aspect_ref_id=aspect_ref_id,
        )

    @property
    def raw_key(self) -> object:
        """Return the raw key."""
        return (self.time_plan.ref_id, self.aspect_ref_id)


class TimePlanAspectLinkRepository(
    RecordRepository[TimePlanAspectLink, tuple[EntityId, EntityId]], abc.ABC
):
    """A repository for time plan aspect links."""

    @abc.abstractmethod
    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""

    @abc.abstractmethod
    async def remove_all_for_aspect(self, aspect_ref_id: EntityId) -> None:
        """Remove all links for a particular aspect."""


@record
class TimePlanChapterLink(Record):
    """A link between a time plan and a chapter."""

    time_plan: ParentLink
    chapter_ref_id: EntityId

    @staticmethod
    @create_record_action
    def new_link(
        ctx: DomainContext, time_plan_ref_id: EntityId, chapter_ref_id: EntityId
    ) -> "TimePlanChapterLink":
        """Create a new link."""
        return TimePlanChapterLink._create(
            ctx,
            time_plan=ParentLink(time_plan_ref_id),
            chapter_ref_id=chapter_ref_id,
        )

    @property
    def raw_key(self) -> object:
        """Return the raw key."""
        return (self.time_plan.ref_id, self.chapter_ref_id)


class TimePlanChapterLinkRepository(
    RecordRepository[TimePlanChapterLink, tuple[EntityId, EntityId]], abc.ABC
):
    """A repository for time plan chapter links."""

    @abc.abstractmethod
    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""

    @abc.abstractmethod
    async def remove_all_for_chapter(self, chapter_ref_id: EntityId) -> None:
        """Find all time plans linked to a particular chapter."""


@record
class TimePlanGoalLink(Record):
    """A link between a time plan and a goal."""

    time_plan: ParentLink
    goal_ref_id: EntityId

    @staticmethod
    @create_record_action
    def new_link(
        ctx: DomainContext, time_plan_ref_id: EntityId, goal_ref_id: EntityId
    ) -> "TimePlanGoalLink":
        """Create a new link."""
        return TimePlanGoalLink._create(
            ctx,
            time_plan=ParentLink(time_plan_ref_id),
            goal_ref_id=goal_ref_id,
        )

    @property
    def raw_key(self) -> object:
        """Return the raw key."""
        return (self.time_plan.ref_id, self.goal_ref_id)


class TimePlanGoalLinkRepository(
    RecordRepository[TimePlanGoalLink, tuple[EntityId, EntityId]], abc.ABC
):
    """A repository for time plan goal links."""

    @abc.abstractmethod
    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""

    @abc.abstractmethod
    async def remove_all_for_goal(self, goal_ref_id: EntityId) -> None:
        """Remove all links for a particular goal."""
