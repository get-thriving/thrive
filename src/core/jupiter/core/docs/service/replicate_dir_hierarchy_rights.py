"""Replicate access grants from the parent_dir_ref_id hierarchy onto docs and dirs."""

from typing import TypeAlias

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.root import AccessDomainRepository
from jupiter.core.common.sub.access.sub.grant.root import AccessGrantRepository
from jupiter.core.common.sub.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.sub.access.sub.status.root import (
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
    """Replicate dir grants along parent_dir_ref_id onto docs and dirs.

    Effective access for a user is the strongest of:
    - a direct GRANT on the entity, and
    - INHERITED access from any ancestor directory grant.

    Sharing a folder therefore gives every nested doc/subdir at least that
    access; a stronger direct grant on a child still wins.
    """

    async def replicate_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Reconcile direct grants and inherited ancestor rights on the entity."""
        await self.refresh_for_entity(ctx, uow, entity)

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
            await uow.get(AccessStatusRepository).remove(status.raw_key)

    async def _rematerialize_direct_grants(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Rewrite GRANT statuses from the entity's surviving AccessGrant rows."""
        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        entity_link = EntityLink.std(entity.__class__.__name__, entity.ref_id)
        grants = await uow.get(AccessGrantRepository).find_all_for_entity(entity_link)
        for grant in grants:
            await uow.get(AccessStatusRepository).upsert(
                AccessStatus.new_access_status(
                    ctx,
                    access_domain.ref_id,
                    entity=entity_link,
                    user_ref_id=grant.user_ref_id,
                    access_level=grant.access_level,
                    reason=AccessStatusReason.GRANT,
                    access_grant_ref_id=grant.ref_id,
                )
            )

    async def _best_inherited_from_ancestors(
        self,
        uow: DomainUnitOfWork,
        parent_dir_ref_id: EntityId | None,
    ) -> dict[EntityId, tuple[AccessLevel, EntityId]]:
        """Max non-owner grant per user across the parent directory chain."""
        best: dict[EntityId, tuple[AccessLevel, EntityId]] = {}
        current_dir_ref_id = parent_dir_ref_id

        while current_dir_ref_id is not None:
            dir_link = EntityLink.std(NamedEntityTag.DIR.value, current_dir_ref_id)
            grants = await uow.get(AccessGrantRepository).find_all_for_entity(dir_link)
            for grant in grants:
                if grant.access_level == AccessLevel.OWNER:
                    continue
                previous = best.get(grant.user_ref_id)
                if previous is None or grant.access_level.is_strictly_stronger_than(
                    previous[0]
                ):
                    best[grant.user_ref_id] = (grant.access_level, grant.ref_id)

            current_dir = await uow.get_for(Dir).load_by_id(current_dir_ref_id)
            current_dir_ref_id = current_dir.parent_dir_ref_id

        return best

    async def _apply_inherited_rights(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Apply ancestor grants when they are strictly stronger than current status."""
        parent_dir_ref_id = entity.parent_dir_ref_id
        if parent_dir_ref_id is None:
            return

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        entity_link = EntityLink.std(entity.__class__.__name__, entity.ref_id)
        best_inherited = await self._best_inherited_from_ancestors(
            uow, parent_dir_ref_id
        )
        status_repository = uow.get(AccessStatusRepository)

        for user_ref_id, (access_level, access_grant_ref_id) in best_inherited.items():
            existing = await status_repository.load_optional_for_entity_and_user(
                entity_link,
                user_ref_id,
            )
            if existing is not None and not access_level.is_strictly_stronger_than(
                existing.access_level
            ):
                continue
            await status_repository.upsert(
                AccessStatus.new_access_status(
                    ctx,
                    access_domain.ref_id,
                    entity=entity_link,
                    user_ref_id=user_ref_id,
                    access_level=access_level,
                    reason=AccessStatusReason.INHERITED,
                    access_grant_ref_id=access_grant_ref_id,
                )
            )

    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: _DocOrDir,
    ) -> None:
        """Reconcile GRANT + INHERITED statuses so the strongest right wins."""
        entity_type = entity.__class__.__name__
        if entity_type not in {NamedEntityTag.DOC.value, NamedEntityTag.DIR.value}:
            return

        await self._clear_inherited_for_entity(ctx, uow, entity)
        await self._rematerialize_direct_grants(ctx, uow, entity)
        await self._apply_inherited_rights(ctx, uow, entity)

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
