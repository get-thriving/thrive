"""Remove a directory and its contents."""

from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import DocRepository
from jupiter.core.docs.sub.doc.service.remove import DocRemoveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class DirRemoveService:
    """Removes a directory, nested directories, and all docs inside them."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        dir_entity: Dir,
    ) -> None:
        """Execute the command's action."""
        if dir_entity.is_root:
            raise Exception("Cannot remove the root directory.")

        child_dirs = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=dir_entity.doc_collection.ref_id,
            allow_archived=True,
            parent_dir_ref_id=[dir_entity.ref_id],
        )

        for child_dir in child_dirs:
            await self.do_it(ctx, uow, progress_reporter, child_dir)

        docs = await uow.get(DocRepository).find_all_for_parent_dir(
            doc_collection_ref_id=dir_entity.doc_collection.ref_id,
            parent_dir_ref_id=dir_entity.ref_id,
            allow_archived=True,
        )

        doc_remove = DocRemoveService()
        for doc in docs:
            await doc_remove.do_it(ctx, uow, progress_reporter, doc)

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.DIR.value, dir_entity.ref_id),
        )

        await uow.get_for(Dir).remove(ctx, dir_entity.ref_id)
        await progress_reporter.mark_removed(dir_entity)
