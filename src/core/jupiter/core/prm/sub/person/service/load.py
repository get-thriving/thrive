"""Shared service for loading a person."""

from typing import cast

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
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class PersonLoadResult(UseCaseResultBase):
    """PersonLoadResult."""

    person: Person
    contact: Contact
    circle_ref_ids: list[EntityId]
    circles: list[Circle]
    occasions: list[Occasion]
    occasion_tags_by_ref_id: dict[EntityId, list[Tag]]
    occasion_time_event_blocks: list[TimeEventFullDaysBlock]
    catch_up_tasks: list[InboxTask]
    catch_up_tasks_total_cnt: int
    catch_up_tasks_page_size: int
    occasion_tasks: list[InboxTask]
    occasion_tasks_total_cnt: int
    occasion_tasks_page_size: int
    tags: list[Tag]
    note: Note | None
    publish_entity: PublishEntity | None


class PersonLoadService:
    """Shared service for loading a person and its dependent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        person: Person,
        *,
        allow_archived: bool = False,
        catch_up_task_retrieve_offset: int = 0,
        occasion_task_retrieve_offset: int = 0,
        include_inbox_tasks: bool = True,
        include_occasion_time_events: bool = True,
        include_publish_entity: bool = True,
    ) -> PersonLoadResult:
        """Load a person and its dependent entities."""
        person = await uow.get_for(Person).load_by_id(
            person.ref_id, allow_archived=allow_archived
        )
        contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
        )
        if contact_link is None or len(contact_link.contacts_ref_ids) == 0:
            raise InputValidationError("Person does not have a linked contact")
        contact = await uow.get_for(Contact).load_by_id(
            contact_link.contacts_ref_ids[0]
        )

        occasions = await uow.get_for(Occasion).find_all_generic(
            parent_ref_id=person.ref_id,
            allow_archived=False,
            ref_id=NoFilter(),
        )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
            allow_archived=allow_archived,
        )

        occasion_time_event_blocks: list[TimeEventFullDaysBlock] = []
        if include_occasion_time_events:
            occasion_time_event_blocks = await uow.get(
                TimeEventFullDaysBlockRepository
            ).find_for_owner(
                [
                    EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                    for o in occasions
                ],
                allow_archived=allow_archived,
            )

        catch_up_tasks: list[InboxTask] = []
        catch_up_tasks_total_cnt = 0
        occasion_tasks: list[InboxTask] = []
        occasion_tasks_total_cnt = 0
        page_size = InboxTaskRepository.PAGE_SIZE

        if include_inbox_tasks:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace_ref_id)

            catch_up_tasks_total_cnt = await uow.get(
                InboxTaskRepository
            ).count_all_for_owner(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
            )

            catch_up_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
                retrieve_offset=catch_up_task_retrieve_offset,
                retrieve_limit=InboxTaskRepository.PAGE_SIZE,
            )

            occasion_tasks_total_cnt = await uow.get(
                InboxTaskRepository
            ).count_all_for_owner(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                    for o in occasions
                ],
            )

            occasion_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                    for o in occasions
                ],
                retrieve_offset=occasion_task_retrieve_offset,
                retrieve_limit=InboxTaskRepository.PAGE_SIZE,
            )

        all_circle_links = await uow.get_for_record(PersonCircleLink).find_all(
            person.prm.ref_id
        )
        circle_ref_ids = [
            link.circle_ref_id
            for link in all_circle_links
            if link.person_ref_id == person.ref_id
        ]

        if circle_ref_ids:
            circles = await uow.get_for(Circle).find_all_generic(
                parent_ref_id=person.prm.ref_id,
                allow_archived=False,
                ref_id=circle_ref_ids,
            )
        else:
            circles = []

        tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace_ref_id)

        tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
            owner=EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        occasion_tag_links = await uow.get(TagLinkRepository).find_all_generic(
            parent_ref_id=tag_domain.ref_id,
            allow_archived=False,
            owner=[
                EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                for o in occasions
            ],
        )
        all_occasion_tag_ref_ids: list[EntityId] = []
        for tl in occasion_tag_links:
            all_occasion_tag_ref_ids.extend(tl.ref_ids)
        if all_occasion_tag_ref_ids:
            occasion_tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_occasion_tag_ref_ids)),
            )
            occasion_tags_by_ref_id_map = {t.ref_id: t for t in occasion_tags}
        else:
            occasion_tags_by_ref_id_map = {}

        occasion_tags_by_ref_id = {
            cast(EntityId, link.owner.ref_id): [
                occasion_tags_by_ref_id_map[rid]
                for rid in link.ref_ids
                if rid in occasion_tags_by_ref_id_map
            ]
            for link in occasion_tag_links
        }

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.PERSON.value, person.ref_id),
                allow_archived=allow_archived,
            )

        return PersonLoadResult(
            person=person,
            contact=contact,
            occasions=occasions,
            occasion_tags_by_ref_id=occasion_tags_by_ref_id,
            circle_ref_ids=circle_ref_ids,
            circles=circles,
            note=note,
            occasion_time_event_blocks=occasion_time_event_blocks,
            catch_up_tasks=catch_up_tasks,
            catch_up_tasks_total_cnt=catch_up_tasks_total_cnt,
            catch_up_tasks_page_size=page_size,
            occasion_tasks=occasion_tasks,
            occasion_tasks_total_cnt=occasion_tasks_total_cnt,
            occasion_tasks_page_size=page_size,
            tags=tags,
            publish_entity=publish_entity,
        )
