"""Shared service for archiving a note."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class NoteArchiveService:
    """A service for removing a note."""

    async def archive(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        note: Note,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the command's action."""
        if note.archived:
            return

        if not note.can_be_removed_independently:
            raise Exception(f"Note {note.ref_id} cannot be removed independently")

        note = note.mark_archived(ctx, archival_reason)
        await uow.get_for(Note).save(note)

    async def archive_for_owner(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get(NoteRepository).load_optional_for_owner(
            owner, allow_archived=True
        )

        if note is None:
            return

        if note.archived:
            return

        note = note.mark_archived(ctx, archival_reason)
        await uow.get_for(Note).save(note)
