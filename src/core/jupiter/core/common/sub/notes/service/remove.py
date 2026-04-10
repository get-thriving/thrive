"""Remove a note."""

from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class NoteRemoveService:
    """A service for removing a note."""

    async def remove(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        note: Note,
        root_is_removed: bool = False,
    ) -> None:
        """Execute the command's action."""
        if not root_is_removed and not note.can_be_removed_independently:
            raise Exception(f"Note {note.ref_id} cannot be removed independently")

        await uow.get_for(Note).remove(note.ref_id)

    async def remove_for_owner(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        root_is_removed: bool = False,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get(NoteRepository).load_optional_for_owner(owner)
        if note is None:
            return
        if not root_is_removed and not note.can_be_removed_independently:
            raise Exception(f"Note {note.ref_id} cannot be removed dependently")
        await uow.get_for(Note).remove(note.ref_id)
