"""The command for finding the persons."""

from collections import defaultdict
from typing import cast

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class PersonFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_occasions: bool | None
    include_circle_ref_ids: bool | None
    include_notes: bool | None
    include_occasion_time_event_blocks: bool | None
    include_catch_up_inbox_tasks: bool | None
    include_occasion_inbox_tasks: bool | None
    include_tags: bool | None
    filter_person_ref_ids: list[EntityId] | None


@use_case_result_part
class PersonFindResultEntry(UseCaseResultBase):
    """A single person result."""

    person: Person
    contact: Contact
    occasions: list[Occasion]
    circle_ref_ids: list[EntityId]
    tags: list[Tag]
    note: Note | None
    occasion_time_event_blocks: list[TimeEventFullDaysBlock] | None
    catch_up_inbox_tasks: list[InboxTask] | None
    occasion_inbox_tasks: list[InboxTask] | None


@use_case_result
class PersonFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[PersonFindResultEntry]


@readonly_use_case(WorkspaceFeature.PRM)
class PersonFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[PersonFindArgs, PersonFindResult]
):
    """The command for finding the persons."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonFindArgs,
    ) -> PersonFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_occasions = args.include_occasions or False
        include_circle_ref_ids = args.include_circle_ref_ids or False
        include_notes = args.include_notes or False
        include_occasion_time_event_blocks = (
            args.include_occasion_time_event_blocks or False
        )
        include_catch_up_inbox_tasks = args.include_catch_up_inbox_tasks or False
        include_occasion_inbox_tasks = args.include_occasion_inbox_tasks or False
        include_tags = args.include_tags or False

        workspace = context.workspace

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )
        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        persons = await uow.get_for(Person).find_all(
            parent_ref_id=prm.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_person_ref_ids,
        )
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id
        )

        contact_links = await uow.get(ContactLinkRepository).find_all_generic(
            allow_archived=True,
            namespace=ContactNamespace.PERSON,
            source_entity_ref_id=[p.ref_id for p in persons],
        )
        contact_link_by_person_ref_id = {
            link.source_entity_ref_id: link for link in contact_links
        }
        contact_ref_ids = [
            link.contacts_ref_ids[0]
            for link in contact_links
            if len(link.contacts_ref_ids) > 0
        ]
        contacts = await uow.get_for(Contact).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=True,
            ref_id=contact_ref_ids,
        )
        contacts_by_ref_id = {contact.ref_id: contact for contact in contacts}

        if include_occasions:
            occasions = await uow.get_for(Occasion).find_all_generic(
                person_ref_id=[p.ref_id for p in persons],
                allow_archived=allow_archived,
            )
            occasions_by_person_ref_id: dict[EntityId, list[Occasion]] = defaultdict(
                list
            )
            for o in occasions:
                occasions_by_person_ref_id[o.person.ref_id].append(o)
        else:
            occasions_by_person_ref_id = defaultdict(list)

        if include_circle_ref_ids:
            all_circle_links = await uow.get_for_record(PersonCircleLink).find_all(
                prm.ref_id
            )
            circle_ref_ids_by_person_ref_id: dict[EntityId, list[EntityId]] = (
                defaultdict(list)
            )
            for link in all_circle_links:
                circle_ref_ids_by_person_ref_id[link.person_ref_id].append(
                    link.circle_ref_id
                )
        else:
            circle_ref_ids_by_person_ref_id = defaultdict(list)

        all_notes_by_person_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            all_notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=notes_collection.ref_id,
                namespace=NoteNamespace.PERSON,
                allow_archived=True,
                source_entity_ref_id=[p.ref_id for p in persons],
            )
            for n in all_notes:
                all_notes_by_person_ref_id[cast(EntityId, n.source_entity_ref_id)] = n

        if include_occasion_time_event_blocks and len(occasions) > 0:
            occasion_time_event_blocks = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=True,
                namespace=TimeEventNamespace.PERSON_OCCASION,
                source_entity_ref_id=[p.ref_id for p in occasions],
            )
        else:
            occasion_time_event_blocks = None

        if include_catch_up_inbox_tasks:
            catch_up_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=[InboxTaskSource.PERSON_CATCH_UP],
                source_entity_ref_id=[p.ref_id for p in persons],
            )
        else:
            catch_up_inbox_tasks = None

        if include_occasion_inbox_tasks and len(occasions) > 0:
            birthday_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=[InboxTaskSource.PERSON_OCCASION],
                source_entity_ref_id=[o.ref_id for o in occasions],
            )
        else:
            birthday_inbox_tasks = None

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.PERSON,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.PERSON,
                source_entity_ref_id=[p.ref_id for p in persons],
            )
            tag_links_by_person_ref_id = {t.source_entity_ref_id: t for t in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_person_ref_id = {}

        entries: list[PersonFindResultEntry] = []
        for p in persons:
            if p.ref_id not in contact_link_by_person_ref_id:
                raise InputValidationError(
                    f"Person #{p.ref_id} does not have a linked contact"
                )
            contact_link = contact_link_by_person_ref_id[p.ref_id]
            if len(contact_link.contacts_ref_ids) == 0:
                raise InputValidationError(f"Person #{p.ref_id} contact link is empty")
            contact_ref_id = contact_link.contacts_ref_ids[0]
            if contact_ref_id not in contacts_by_ref_id:
                raise InputValidationError(
                    f"Person #{p.ref_id} linked contact could not be loaded"
                )

            entries.append(
                PersonFindResultEntry(
                    person=p,
                    contact=contacts_by_ref_id[contact_ref_id],
                    occasions=occasions_by_person_ref_id.get(p.ref_id, []),
                    circle_ref_ids=circle_ref_ids_by_person_ref_id.get(p.ref_id, []),
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_person_ref_id[p.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if p.ref_id in tag_links_by_person_ref_id
                        else []
                    ),
                    note=all_notes_by_person_ref_id.get(p.ref_id, None),
                    occasion_time_event_blocks=(
                        [
                            it
                            for it in occasion_time_event_blocks
                            if it.source_entity_ref_id == p.ref_id
                        ]
                        if occasion_time_event_blocks is not None
                        else None
                    ),
                    catch_up_inbox_tasks=(
                        [
                            it
                            for it in catch_up_inbox_tasks
                            if it.source_entity_ref_id == p.ref_id
                        ]
                        if catch_up_inbox_tasks is not None
                        else None
                    ),
                    occasion_inbox_tasks=(
                        [
                            it
                            for it in birthday_inbox_tasks
                            if it.source_entity_ref_id == p.ref_id
                        ]
                        if birthday_inbox_tasks is not None
                        else None
                    ),
                )
            )

        return PersonFindResult(
            entries=entries,
        )
