"""Replicate access grants from the parent_dir_ref_id hierarchy onto docs and dirs."""

from typing import TypeAlias

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.root import AccessDomainRepository
from jupiter.core.common.access.sub.grant.root import AccessGrantRepository
from jupiter.core.common.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import Doc, DocRepository
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork

_DocOrDir: TypeAlias = Doc | Dir


class ReplicateDirHierarchyRightsService:
    """Replicate dir grants along parent_dir_ref_id onto docs and dirs."""

    async def replicate_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Walk parent_dir_ref_id ancestors and inherit each dir's grants."""
        entity_type = entity.__class__.__name__
        if entity_type not in {NamedEntityTag.DOC.value, NamedEntityTag.DIR.value}:
            return

        parent_dir_ref_id = entity.parent_dir_ref_id
        if parent_dir_ref_id is None:
            return

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        entity_link = EntityLink.std(entity_type, entity.ref_id)

        seen_users: set[EntityId] = set()
        current_dir_ref_id: EntityId | None = parent_dir_ref_id

        while current_dir_ref_id is not None:
            dir_link = EntityLink.std(NamedEntityTag.DIR.value, current_dir_ref_id)
            grants = await uow.get(AccessGrantRepository).find_all_for_entity(dir_link)
            for grant in grants:
                if grant.access_level == AccessLevel.OWNER:
                    continue
                if grant.user_ref_id in seen_users:
                    continue
                seen_users.add(grant.user_ref_id)
                await uow.get(AccessStatusRepository).upsert(
                    AccessStatus.new_access_status(
                        ctx,
                        access_domain.ref_id,
                        entity=entity_link,
                        user_ref_id=grant.user_ref_id,
                        access_level=grant.access_level,
                        reason=AccessStatusReason.INHERITED,
                    )
                )

            current_dir = await uow.get_for(Dir).load_by_id(current_dir_ref_id)
            current_dir_ref_id = current_dir.parent_dir_ref_id

    async def _clear_inherited_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Remove all inherited access statuses on the entity."""
        entity_link = EntityLink.std(entity.__class__.__name__, entity.ref_id)
        statuses = await uow.get(AccessStatusRepository).find_all_for_entity(
            entity_link
        )
        for status in statuses:
            if status.reason != AccessStatusReason.INHERITED:
                continue
            await uow.get(AccessStatusRepository).remove(ctx, status.ref_id)

    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Clear inherited dir-hierarchy statuses and re-replicate from the new path."""
        await self._clear_inherited_for_entity(ctx, uow, entity)
        await self.replicate_for_entity(ctx, uow, entity)

    async def refresh_for_dir_and_descendants(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        dir_entity: Dir,
    ) -> None:
        """Refresh inherited rights for a directory and everything nested under it."""
        await self.refresh_for_entity(ctx, uow, dir_entity)

        child_dirs = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=dir_entity.doc_collection.ref_id,
            allow_archived=False,
            parent_dir_ref_id=[dir_entity.ref_id],
        )
        for child_dir in child_dirs:
            await self.refresh_for_dir_and_descendants(ctx, uow, child_dir)

        docs = await uow.get(DocRepository).find_all_for_parent_dir(
            doc_collection_ref_id=dir_entity.doc_collection.ref_id,
            parent_dir_ref_id=dir_entity.ref_id,
            allow_archived=False,
        )
        for doc in docs:
            await self.refresh_for_entity(ctx, uow, doc)
