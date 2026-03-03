"""Use case for loading a person."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
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
)


@use_case_args
class PersonLoadArgs(UseCaseArgsBase):
    """PersonLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    catch_up_task_retrieve_offset: int | None
    occasion_task_retrieve_offset: int | None


@use_case_result
class PersonLoadResult(UseCaseResultBase):
    """PersonLoadResult."""

    person: Person
    contact: Contact
    circle_ref_ids: list[EntityId]
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


@readonly_use_case(WorkspaceFeature.PRM)
class PersonLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[PersonLoadArgs, PersonLoadResult]
):
    """Use case for loading a person."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonLoadArgs,
    ) -> PersonLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        if (
            args.catch_up_task_retrieve_offset is not None
            and args.catch_up_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid catch_up_inbox_task_retrieve_offset")
        if (
            args.occasion_task_retrieve_offset is not None
            and args.occasion_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid occasion_inbox_task_retrieve_offset")

        workspace = context.workspace
        person = await uow.get_for(Person).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        contact_link = await uow.get(
            ContactLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=ContactNamespace.PERSON,
            source_entity_ref_id=person.ref_id,
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

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.PERSON,
            person.ref_id,
            allow_archived=allow_archived,
        )

        occasion_time_event_blocks = await uow.get(
            TimeEventFullDaysBlockRepository
        ).find_for_namespace(
            TimeEventNamespace.PERSON_OCCASION,
            [o.ref_id for o in occasions],
            allow_archived=allow_archived,
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        catch_up_tasks_total_cnt = await uow.get(
            InboxTaskRepository
        ).count_all_for_source(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_CATCH_UP,
            source_entity_ref_id=args.ref_id,
        )

        catch_up_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_CATCH_UP,
            source_entity_ref_id=args.ref_id,
            retrieve_offset=args.catch_up_task_retrieve_offset or 0,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
        )

        occasion_tasks_total_cnt = await uow.get(
            InboxTaskRepository
        ).count_all_for_source(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_OCCASION,
            source_entity_ref_id=[o.ref_id for o in occasions],
        )

        occasion_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_OCCASION,
            source_entity_ref_id=[o.ref_id for o in occasions],
            retrieve_offset=args.occasion_task_retrieve_offset or 0,
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

        tag_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.PERSON,
            source_entity_ref_id=person.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        occasion_tags = await uow.get(TagRepository).find_all_generic(
            parent_ref_id=tag_domain.ref_id,
            allow_archived=False,
            namespace=TagNamespace.OCCASION,
        )

        occasion_tag_links = await uow.get(TagLinkRepository).find_all_generic(
            parent_ref_id=tag_domain.ref_id,
            namespace=TagNamespace.OCCASION,
            source_entity_ref_id=[o.ref_id for o in occasions],
        )

        occasion_tags_by_ref_id = {
            link.source_entity_ref_id: [
                t for t in occasion_tags if t.ref_id in link.ref_ids
            ]
            for link in occasion_tag_links
        }

        return PersonLoadResult(
            person=person,
            contact=contact,
            occasions=occasions,
            occasion_tags_by_ref_id=occasion_tags_by_ref_id,
            circle_ref_ids=circle_ref_ids,
            note=note,
            occasion_time_event_blocks=occasion_time_event_blocks,
            catch_up_tasks=catch_up_tasks,
            catch_up_tasks_total_cnt=catch_up_tasks_total_cnt,
            catch_up_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            occasion_tasks=occasion_tasks,
            occasion_tasks_total_cnt=occasion_tasks_total_cnt,
            occasion_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            tags=tags,
        )
