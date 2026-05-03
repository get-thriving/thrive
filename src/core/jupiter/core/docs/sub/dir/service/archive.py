"""Archive a directory and its contents."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import DocRepository
from jupiter.core.docs.sub.doc.service.archive import DocArchiveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class DirArchiveService:
    """Archives a directory, nested directories, and all docs inside them."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        dir_entity: Dir,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the command's action."""
        if dir_entity.archived:
            return

        if dir_entity.is_root:
            raise Exception("Cannot archive the root directory.")

        child_dirs = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=dir_entity.doc_collection.ref_id,
            allow_archived=True,
            parent_dir_ref_id=[dir_entity.ref_id],
        )

        for child_dir in child_dirs:
            await self.do_it(ctx, uow, progress_reporter, child_dir, archival_reason)

        docs = await uow.get(DocRepository).find_all_for_parent_dir(
            doc_collection_ref_id=dir_entity.doc_collection.ref_id,
            parent_dir_ref_id=dir_entity.ref_id,
            allow_archived=True,
        )

        doc_archive = DocArchiveService()
        for doc in docs:
            await doc_archive.do_it(ctx, uow, progress_reporter, doc, archival_reason)

        dir_entity = dir_entity.mark_archived(ctx, archival_reason)
        await uow.get_for(Dir).save(dir_entity)
        await progress_reporter.mark_updated(dir_entity)

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.DIR.value, dir_entity.ref_id),
            archival_reason,
        )
