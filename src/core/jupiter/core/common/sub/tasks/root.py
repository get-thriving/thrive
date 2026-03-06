"""A task in the task domain."""

import abc
from collections.abc import Iterable

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.status import TaskStatus
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class Task(LeafSupportEntity):
    """A task in the task domain."""

    task_domain: ParentLink
    namespace: TaskNamespace
    source_entity_ref_id: EntityId
    name: EntityName
    status: TaskStatus
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_date: ADate | None
    due_date: ADate | None
    recurring_timeline: str | None
    recurring_repeat_index: int | None
    recurring_gen_right_now: Timestamp | None
    working_time: Timestamp | None
    completed_time: Timestamp | None

    @property
    def source_entity_ref_id_for_sure(self) -> EntityId:
        """Get the source entity ref id."""
        return self.source_entity_ref_id

    @staticmethod
    def _build_name_for_habit(
        name: EntityName,
        repeat_index: int,
        repeats_in_period_count: int | None,
    ) -> EntityName:
        """Build the persisted task name for a habit occurrence."""
        if repeats_in_period_count is None:
            return name
        return EntityName(f"{name} ({repeat_index + 1}/{repeats_in_period_count})")

    @staticmethod
    @create_entity_action
    def new_task(
        ctx: MutationContext,
        task_domain_ref_id: EntityId,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        name: EntityName,
        status: TaskStatus,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        recurring_timeline: str | None,
        recurring_repeat_index: int | None,
        recurring_gen_right_now: Timestamp | None,
    ) -> "Task":
        """Create a task."""
        return Task._create(
            ctx,
            task_domain=ParentLink(task_domain_ref_id),
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            name=name,
            status=status,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            recurring_timeline=recurring_timeline,
            recurring_repeat_index=recurring_repeat_index,
            recurring_gen_right_now=recurring_gen_right_now,
            working_time=ctx.action_timestamp if status.is_working_or_more else None,
            completed_time=ctx.action_timestamp if status.is_completed else None,
        )

    @staticmethod
    @create_entity_action
    def new_task_for_habit(
        ctx: MutationContext,
        task_domain_ref_id: EntityId,
        source_entity_ref_id: EntityId,
        name: EntityName,
        is_key: bool,
        eisen: Eisen,
        difficulty: Difficulty,
        actionable_date: ADate | None,
        due_date: ADate | None,
        recurring_timeline: str,
        recurring_repeat_index: int,
        recurring_gen_right_now: Timestamp,
        repeats_in_period_count: int | None,
    ) -> "Task":
        """Create a task linked to a habit."""
        return Task._create(
            ctx,
            task_domain=ParentLink(task_domain_ref_id),
            namespace=TaskNamespace.HABIT,
            source_entity_ref_id=source_entity_ref_id,
            name=Task._build_name_for_habit(
                name, recurring_repeat_index, repeats_in_period_count
            ),
            status=TaskStatus.NOT_STARTED_GEN,
            is_key=is_key,
            eisen=eisen,
            difficulty=difficulty,
            actionable_date=actionable_date,
            due_date=due_date,
            recurring_timeline=recurring_timeline,
            recurring_repeat_index=recurring_repeat_index,
            recurring_gen_right_now=recurring_gen_right_now,
            working_time=None,
            completed_time=None,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[EntityName],
        status: UpdateAction[TaskStatus],
        is_key: UpdateAction[bool],
        eisen: UpdateAction[Eisen],
        difficulty: UpdateAction[Difficulty],
        actionable_date: UpdateAction[ADate | None],
        due_date: UpdateAction[ADate | None],
        recurring_timeline: UpdateAction[str | None],
        recurring_repeat_index: UpdateAction[int | None],
        recurring_gen_right_now: UpdateAction[Timestamp | None],
    ) -> "Task":
        """Update the task."""
        new_status = status.or_else(self.status)

        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            status=new_status,
            is_key=is_key.or_else(self.is_key),
            eisen=eisen.or_else(self.eisen),
            difficulty=difficulty.or_else(self.difficulty),
            actionable_date=actionable_date.or_else(self.actionable_date),
            due_date=due_date.or_else(self.due_date),
            recurring_timeline=recurring_timeline.or_else(self.recurring_timeline),
            recurring_repeat_index=recurring_repeat_index.or_else(
                self.recurring_repeat_index
            ),
            recurring_gen_right_now=recurring_gen_right_now.or_else(
                self.recurring_gen_right_now
            ),
            working_time=(
                ctx.action_timestamp
                if new_status.is_working_or_more and self.working_time is None
                else self.working_time
            ),
            completed_time=(
                ctx.action_timestamp
                if new_status.is_completed and self.completed_time is None
                else self.completed_time
            ),
        )

    @update_entity_action
    def update_link_to_habit(
        self,
        ctx: MutationContext,
        name: EntityName,
        timeline: str,
        repeat_index: int,
        repeats_in_period_count: int | None,
        is_key: bool,
        actionable_date: ADate | None,
        due_date: ADate,
        eisen: Eisen,
        difficulty: Difficulty,
    ) -> "Task":
        """Update all the info associated with a habit."""
        if self.namespace is not TaskNamespace.HABIT:
            raise Exception(
                f"Cannot associate a task which is not a habit for '{self.name}'"
            )
        return self._new_version(
            ctx,
            name=Task._build_name_for_habit(
                name, repeat_index, repeats_in_period_count
            ),
            is_key=is_key,
            actionable_date=actionable_date,
            due_date=due_date,
            eisen=eisen,
            difficulty=difficulty,
            recurring_timeline=timeline,
            recurring_repeat_index=repeat_index,
        )


class TaskRepository(LeafEntityRepository[Task], abc.ABC):
    """A repository of tasks."""

    PAGE_SIZE = 10

    @abc.abstractmethod
    async def load_for_source(
        self,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> Task:
        """Load a particular task via its source entity."""

    @abc.abstractmethod
    async def load_optional_for_source(
        self,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> Task | None:
        """Load a particular task via its source entity."""

    @abc.abstractmethod
    async def count_all_for_source(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: bool = False,
    ) -> int:
        """Count all tasks for a source or a set of sources."""

    @abc.abstractmethod
    async def find_all_for_source_created_desc(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: bool = False,
        retrieve_offset: int | None = None,
        retrieve_limit: int | None = None,
    ) -> list[Task]:
        """Find all tasks for a source ordered from newest to oldest."""

    @abc.abstractmethod
    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        allow_archived: bool,
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_source_entity_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[Task]:
        """Find completed tasks in a date range for a namespace."""
