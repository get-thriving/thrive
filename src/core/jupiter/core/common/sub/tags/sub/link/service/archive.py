"""Shared service for archiving a tag link."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink, TagLinkRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class TagLinkArchiveService:
    """A service for archiving a tag link."""

    async def archive_for_entity(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: TagNamespace,
        source_entity_ref_id: EntityId,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a tag link for an entity."""
        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
        )
        if tag_link is None:
            return
        if tag_link.archived:
            return
        tag_link = tag_link.mark_archived(ctx, archival_reason)
        await uow.get_for(TagLink).save(tag_link)
