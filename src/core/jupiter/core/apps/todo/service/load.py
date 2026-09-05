"""Shared service for loading a todo task and its dependent entities."""

from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.locations.sub.link.root import LocationLinkRepository
from jupiter.core.common.sub.locations.sub.link.service.load import (
    LoadLocationForLinkService,
)
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class TodoTaskLoadResult(UseCaseResultBase):
    """TodoTaskLoadResult."""

    todo_task: TodoTask
    inbox_task: InboxTask
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    tags: list[Tag]
    contacts: list[Contact]
    location: Location | None
    note: Note | None
    publish_entity: PublishEntity | None
    time_event_blocks: list[TimeEventInDayBlock]
    owner: UserLight
    access_status: AccessStatus | None


class TodoTaskLoadService:
    """Shared service for loading a todo task and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        todo_task: TodoTask,
        *,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
    ) -> TodoTaskLoadResult:
        """Load a todo task together with the entities that hang off it.

        Callers must have already authorized access to the todo task (via ACL or
        publish). Life-plan crown entities referenced on the todo task are loaded
        below without a separate ACL check.
        """
        # Aspect/chapter/goal are crown entities, but readable because the
        # caller already proved access to the todo task that references them.
        aspect = await uow.get_for(Aspect).load_by_id(todo_task.aspect_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(todo_task.chapter_ref_id)
            if todo_task.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(todo_task.goal_ref_id)
            if todo_task.goal_ref_id
            else None
        )

        linked_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )
        if len(linked_inbox_tasks) == 0:
            raise InputValidationError(
                f"No inbox task associated with todo task '{todo_task.ref_id}'"
            )
        if len(linked_inbox_tasks) > 1:
            raise InputValidationError(
                f"Multiple inbox tasks associated with todo task '{todo_task.ref_id}'"
            )
        inbox_task = linked_inbox_tasks[0]

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )
        publish_entity = await uow.get(PublishEntityRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        location_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )
        location = await LoadLocationForLinkService().do_it(uow, location_link)

        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
        )

        todo_entity_link = EntityLink.std(
            NamedEntityTag.TODO_TASK.value, todo_task.ref_id
        )
        owner = await LoadUserThatOwnsEntityService().do_it(uow, todo_entity_link)
        access_status = (
            await GetAccessLevelForEntityService().do_it(
                uow, todo_entity_link, user_ref_id
            )
            if user_ref_id is not None
            else None
        )

        return TodoTaskLoadResult(
            todo_task=todo_task,
            inbox_task=inbox_task,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            tags=tags,
            contacts=contacts,
            location=location,
            note=note,
            publish_entity=publish_entity,
            time_event_blocks=time_event_blocks,
            owner=owner,
            access_status=access_status,
        )
