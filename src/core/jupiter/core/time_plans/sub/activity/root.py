"""A certain activity that happens in a plan."""

import abc

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


@entity("TimePlan")
class TimePlanActivity(LeafEntity):
    """A certain activity that happens in a plan."""

    time_plan: ParentLink

    target: EntityLink
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability

    note = OwnsAtMostOne(
        Note, owner=IsEntityLinkStd(NamedEntityTag.TIME_PLAN_ACTIVITY.value)
    )
    time_event_in_day_blocks = OwnsMany(
        TimeEventInDayBlock,
        owner=IsEntityLinkStd(NamedEntityTag.TIME_PLAN_ACTIVITY.value),
    )

    @staticmethod
    @create_entity_action
    def new_activity_from_existing(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        existing_activity_name: EntityName,
        existing_activity_target: EntityLink,
        existing_activity_kind: TimePlanActivityKind,
        existing_activity_feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new actvity from an existing one."""
        return TimePlanActivity._create(
            ctx,
            name=existing_activity_name,
            time_plan=ParentLink(time_plan_ref_id),
            target=existing_activity_target,
            kind=existing_activity_kind,
            feasability=existing_activity_feasability,
        )

    @staticmethod
    @create_entity_action
    def new_activity_for_inbox_task(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        inbox_task_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from an inbox task."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("inbox-task", inbox_task_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std("InboxTask", inbox_task_ref_id),
            kind=kind,
            feasability=feasability,
        )

    @staticmethod
    @create_entity_action
    def new_activity_for_big_plan(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        big_plan_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from a big plan."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("big-plan", big_plan_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std(NamedEntityTag.BIG_PLAN.value, big_plan_ref_id),
            kind=kind,
            feasability=feasability,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        kind: UpdateAction[TimePlanActivityKind],
        feasability: UpdateAction[TimePlanActivityFeasability],
    ) -> "TimePlanActivity":
        """Update the details of an activity."""
        return self._new_version(
            ctx,
            kind=kind.or_else(self.kind),
            feasability=feasability.or_else(self.feasability),
        )

    @staticmethod
    def _build_name(target_kind_label: str, entity_id: EntityId) -> EntityName:
        return EntityName(f"Work on {target_kind_label} {entity_id}")

    @property
    def target_ref_id(self) -> EntityId:
        """The reference id of the target entity."""
        return self.target.ref_id

    @property
    def is_target_inbox_task(self) -> bool:
        """Whether the target is an inbox task."""
        return self.target.the_type == "InboxTask" and self.target.purpose == "std"

    @property
    def is_target_big_plan(self) -> bool:
        """Whether the target is a big plan."""
        return (
            self.target.the_type == NamedEntityTag.BIG_PLAN.value
            and self.target.purpose == "std"
        )


class TimePlanAlreadyAssociatedWithTargetError(EntityAlreadyExistsError):
    """An error raised when a time plan is already associated with a target entity."""


class TimePlanActivityRespository(LeafEntityRepository[TimePlanActivity], abc.ABC):
    """An error raised when a time plan is already associated with a target entity."""

    @abc.abstractmethod
    async def find_all_with_target(
        self,
        target: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> list[EntityId]:
        """Find all time plan ids with a certain entity in their activity set."""
