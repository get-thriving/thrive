"""Remove a person."""

from jupiter.core.domain.concept.persons.person import Person
from jupiter.core.domain.concept.persons.person_collection import PersonCollection
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.notes.service.note_remove_service import NoteRemoveService
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTaskRepository
from jupiter.core.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
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
        person_collection: PersonCollection,
        person: Person,
    ) -> None:
        """Execute the command's action."""
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            person_collection.workspace.ref_id,
        )
        all_birthday_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_BIRTHDAY,
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
        await note_remove_service.remove_for_source(
            ctx, uow, NoteDomain.PERSON, person.ref_id
        )

        await uow.get_for(Person).remove(person.ref_id)
        await progress_reporter.mark_removed(person)
