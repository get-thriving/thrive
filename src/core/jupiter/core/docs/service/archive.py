"""Archive a doc."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.docs.root import Doc
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class DocArchiveService:
    """A service for removing a doc."""

    async def do_it(
        self,
        ctx: DomainContext,
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
            ctx, uow, NoteNamespace.DOC, doc.ref_id, archival_reason
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx, uow, TagNamespace.DOC, doc.ref_id, archival_reason
        )
