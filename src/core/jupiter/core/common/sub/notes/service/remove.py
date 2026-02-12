"""Remove a note."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class NoteRemoveService:
    """A service for removing a note."""

    async def remove(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        note: Note,
    ) -> None:
        """Execute the command's action."""
        if note.can_be_removed_independently:
            raise Exception(f"Note {note.ref_id} cannot be removed independently")

        await uow.get_for(Note).remove(note.ref_id)

    async def remove_for_source(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        domain: NoteNamespace,
        source_entity_ref_id: EntityId,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get(NoteRepository).load_optional_for_source(
            domain, source_entity_ref_id
        )
        if note is None:
            return
        if not note.can_be_removed_independently:
            raise Exception(f"Note {note.ref_id} cannot be removed dependently")
        await uow.get_for(Note).remove(note.ref_id)
