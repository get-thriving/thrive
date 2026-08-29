"""A certain activity that happens in a plan."""

import abc

from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.target import TimePlanActivityTarget
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
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
    def new_activity_for_todo_task(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        todo_task_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from a todo task."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("todo-task", todo_task_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task_ref_id),
            kind=kind,
            feasability=feasability,
        )

    @staticmethod
    @create_entity_action
    def new_activity_for_habit(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        habit_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from a habit."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("habit", habit_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std(NamedEntityTag.HABIT.value, habit_ref_id),
            kind=kind,
            feasability=feasability,
        )

    @staticmethod
    @create_entity_action
    def new_activity_for_chore(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        chore_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from a chore."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("chore", chore_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std(NamedEntityTag.CHORE.value, chore_ref_id),
            kind=kind,
            feasability=feasability,
        )

    @staticmethod
    @create_entity_action
    def new_activity_for_project(
        ctx: DomainContext,
        time_plan_ref_id: EntityId,
        project_ref_id: EntityId,
        kind: TimePlanActivityKind,
        feasability: TimePlanActivityFeasability,
    ) -> "TimePlanActivity":
        """Create a new activity from a project."""
        return TimePlanActivity._create(
            ctx,
            name=TimePlanActivity._build_name("project", project_ref_id),
            time_plan=ParentLink(time_plan_ref_id),
            target=EntityLink.std(NamedEntityTag.PROJECT.value, project_ref_id),
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
    def is_target_project(self) -> bool:
        """Whether the target is a project."""
        return (
            self.target.the_type == NamedEntityTag.PROJECT.value
            and self.target.purpose == "std"
        )

    @property
    def is_target_todo_task(self) -> bool:
        """Whether the target is a todo task."""
        return (
            self.target.the_type == NamedEntityTag.TODO_TASK.value
            and self.target.purpose == "std"
        )

    @property
    def is_target_habit(self) -> bool:
        """Whether the target is a habit."""
        return (
            self.target.the_type == NamedEntityTag.HABIT.value
            and self.target.purpose == "std"
        )

    @property
    def is_target_chore(self) -> bool:
        """Whether the target is a chore."""
        return (
            self.target.the_type == NamedEntityTag.CHORE.value
            and self.target.purpose == "std"
        )

    @property
    def target_kind(self) -> TimePlanActivityTarget:
        """The kind of target for this activity."""
        if self.is_target_todo_task:
            return TimePlanActivityTarget.TODO_TASK
        if self.is_target_habit:
            return TimePlanActivityTarget.HABIT
        if self.is_target_chore:
            return TimePlanActivityTarget.CHORE
        if self.is_target_project:
            return TimePlanActivityTarget.PROJECT
        if self.is_target_inbox_task:
            return TimePlanActivityTarget.INBOX_TASK
        raise Exception(f"Unknown target type: {self.target}")


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
