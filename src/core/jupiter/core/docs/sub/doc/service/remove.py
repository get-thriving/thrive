"""Remove a doc."""

from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class DocRemoveService:
    """A service for removing a doc."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        doc: Doc,
    ) -> None:
        """Execute the command's action."""
        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
            root_is_removed=True,
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.DOC.value, doc.ref_id),
        )

        await uow.get_for(Doc).remove(ctx, doc.ref_id)
        await progress_reporter.mark_removed(doc)
