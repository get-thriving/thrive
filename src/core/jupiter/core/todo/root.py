"""A todo task."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.namespace import TimeEventNamespace
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.todo.name import TodoTaskName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("TodoDomain")
class TodoTask(LeafEntity):
    """A todo task."""

    todo_domain: ParentLink

    name: TodoTaskName
    aspect_ref_id: EntityId
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None

    inbox_task = OwnsOne(
        InboxTask,
        namespace=InboxTaskNamespace.TODO_TASK,
        source_entity_ref_id=IsRefId(),
    )  # pyright: ignore[reportUndefinedVariable]
    time_event_in_day_blocks = OwnsMany(
        TimeEventInDayBlock,
        namespace=TimeEventNamespace.TODO_TASK,
        source_entity_ref_id=IsRefId(),
    )
    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.TODO_TASK, source_entity_ref_id=IsRefId()
    )
    contact_link = OwnsAtMostOne(
        ContactLink,
        namespace=ContactNamespace.TODO_TASK,
        source_entity_ref_id=IsRefId(),
    )
    note = OwnsAtMostOne(
        Note, owner=IsEntityLinkStd(NamedEntityTag.TODO_TASK.value)
    )

    @staticmethod
    @create_entity_action
    def new_todo_task(
        ctx: DomainContext,
        todo_domain_ref_id: EntityId,
        aspect_ref_id: EntityId,
        chapter_ref_id: EntityId | None,
        goal_ref_id: EntityId | None,
        name: TodoTaskName,
    ) -> "TodoTask":
        """Create a todo task."""
        return TodoTask._create(
            ctx,
            todo_domain=ParentLink(todo_domain_ref_id),
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[TodoTaskName],
        aspect_ref_id: UpdateAction[EntityId],
        chapter_ref_id: UpdateAction[EntityId | None],
        goal_ref_id: UpdateAction[EntityId | None],
    ) -> "TodoTask":
        """Update the todo task."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            aspect_ref_id=aspect_ref_id.or_else(self.aspect_ref_id),
            chapter_ref_id=chapter_ref_id.or_else(self.chapter_ref_id),
            goal_ref_id=goal_ref_id.or_else(self.goal_ref_id),
        )
