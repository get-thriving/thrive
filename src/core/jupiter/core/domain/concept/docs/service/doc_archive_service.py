"""Archive a doc."""

from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.notes.service.note_archive_service import (
    NoteArchiveService,
)
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork


class DocArchiveService:
    """A service for removing a doc."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        doc: Doc,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the command's action."""
        if doc.archived:
            return

        subdocs = await uow.get_for(Doc).find_all_generic(
            parent_ref_id=doc.doc_collection.ref_id,
            allow_archived=True,
            parent_doc_ref_id=[doc.ref_id],
        )

        for subdoc in subdocs:
            await self.do_it(ctx, uow, progress_reporter, subdoc, archival_reason)

        doc = doc.mark_archived(ctx, archival_reason)
        await uow.get_for(Doc).save(doc)
        await progress_reporter.mark_updated(doc)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            ctx, uow, NoteDomain.DOC, doc.ref_id, archival_reason
        )
