"""Remove a person."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.sub.link.service.remove import (
    ContactLinkRemoveService,
)
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class PersonRemoveService:
    """The command for removing a person."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        prm: PRM,
        person: Person,
    ) -> None:
        """Execute the command's action."""
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            prm.workspace.ref_id,
        )
        all_birthday_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_OCCASION,
            source_entity_ref_id=person.ref_id,
        )
        all_catch_up_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_CATCH_UP,
            source_entity_ref_id=person.ref_id,
        )
        all_inbox_tasks = all_birthday_inbox_tasks + all_catch_up_inbox_tasks

        inbox_task_remove_service = InboxTaskRemoveService()
        for inbox_task in all_inbox_tasks:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        note_remove_service = NoteRemoveService()
        tag_link_remove_service = TagLinkRemoveService()

        all_occasions = await uow.get_for(Occasion).find_all(
            person.ref_id, allow_archived=True
        )
        for occasion in all_occasions:
            await note_remove_service.remove_for_source(
                ctx, uow, NoteNamespace.OCCASION, occasion.ref_id
            )
            await tag_link_remove_service.remove_for_entity(
                ctx, uow, TagNamespace.OCCASION, occasion.ref_id
            )
            await uow.get_for(Occasion).remove(occasion.ref_id)
            await progress_reporter.mark_removed(occasion)

        await note_remove_service.remove_for_source(
            ctx, uow, NoteNamespace.PERSON, person.ref_id
        )

        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.PERSON, person.ref_id
        )
        await ContactLinkRemoveService().remove_for_entity(
            ctx,
            uow,
            ContactNamespace.PERSON,
            person.ref_id,
        )

        all_links = await uow.get_for_record(PersonCircleLink).find_all(prm.ref_id)
        for link in all_links:
            if link.person_ref_id != person.ref_id:
                continue
            await uow.get_for_record(PersonCircleLink).remove(
                (prm.ref_id, person.ref_id, link.circle_ref_id)
            )

        await uow.get_for(Person).remove(person.ref_id)
        await progress_reporter.mark_removed(person)
