"""Shared service for loading a chore and its dependent entities."""

from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class ChoreLoadResult(UseCaseResultBase):
    """ChoreLoadResult."""

    chore: Chore
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask]
    inbox_tasks_total_cnt: int
    inbox_tasks_page_size: int
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]
    publish_entity: PublishEntity | None


class ChoreLoadService:
    """Shared service for loading a chore and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        chore: Chore,
        *,
        allow_archived: bool = False,
        inbox_task_retrieve_offset: int = 0,
        include_publish_entity: bool = True,
    ) -> ChoreLoadResult:
        """Load a chore and its dependent entities.

        Callers must have already authorized access to the chore (via ACL or
        publish). Life-plan crown entities referenced on the chore are loaded
        below without a separate ACL check.
        """
        chore = await uow.get_for(Chore).load_by_id(
            chore.ref_id, allow_archived=allow_archived
        )
        # Aspect/chapter/goal are crown entities, but readable because the
        # caller already proved access to the chore that references them.
        aspect = await uow.get_for(Aspect).load_by_id(chore.aspect_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(chore.chapter_ref_id)
            if chore.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(chore.goal_ref_id)
            if chore.goal_ref_id
            else None
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace_ref_id,
        )

        inbox_tasks_total_cnt = await uow.get(InboxTaskRepository).count_all_for_owner(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=allow_archived,
            owner=EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
            retrieve_offset=inbox_task_retrieve_offset,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
            allow_archived=allow_archived,
        )

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace_ref_id,
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace_ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            parent_ref_id=time_event_domain.ref_id,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
        )

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
                allow_archived=allow_archived,
            )

        return ChoreLoadResult(
            chore=chore,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            inbox_tasks=inbox_tasks,
            inbox_tasks_total_cnt=inbox_tasks_total_cnt,
            inbox_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            tags=tags,
            contacts=contacts,
            note=note,
            time_event_blocks=time_event_blocks,
            publish_entity=publish_entity,
        )
