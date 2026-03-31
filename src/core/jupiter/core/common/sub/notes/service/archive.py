"""Shared service for archiving a note."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.framework.base.entity_id import EntityId
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

    async def archive_for_source(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        domain: NoteNamespace,
        source_entity_ref_id: EntityId,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the command's action."""
        note = await uow.get(NoteRepository).load_optional_for_source(
            domain, source_entity_ref_id, allow_archived=True
        )

        if note is None:
            return

        if note.archived:
            return

        note = note.mark_archived(ctx, archival_reason)
        await uow.get_for(Note).save(note)
