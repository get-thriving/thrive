"""Replicate access grants from the parent_aspect_ref_id hierarchy onto aspects."""

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.root import AccessDomainRepository
from jupiter.core.common.access.sub.grant.root import AccessGrantRepository
from jupiter.core.common.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ReplicateAspectHierarchyRightsService:
    """Replicate aspect grants along parent_aspect_ref_id onto child aspects."""

    async def replicate_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        aspect: Aspect,
    ) -> None:
        """Walk parent_aspect_ref_id ancestors and inherit each aspect's grants."""
        parent_aspect_ref_id = aspect.parent_aspect_ref_id
        if parent_aspect_ref_id is None:
            return

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        aspect_link = EntityLink.std(NamedEntityTag.ASPECT.value, aspect.ref_id)

        seen_users: set[EntityId] = set()
        current_aspect_ref_id: EntityId | None = parent_aspect_ref_id

        while current_aspect_ref_id is not None:
            parent_link = EntityLink.std(
                NamedEntityTag.ASPECT.value, current_aspect_ref_id
            )
            grants = await uow.get(AccessGrantRepository).find_all_for_entity(
                parent_link
            )
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
                        entity=aspect_link,
                        user_ref_id=grant.user_ref_id,
                        access_level=grant.access_level,
                        reason=AccessStatusReason.INHERITED,
                    )
                )

            current_aspect = await uow.get_for(Aspect).load_by_id(current_aspect_ref_id)
            current_aspect_ref_id = current_aspect.parent_aspect_ref_id

    async def _clear_inherited_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        aspect: Aspect,
    ) -> None:
        """Remove all inherited access statuses on the aspect."""
        aspect_link = EntityLink.std(NamedEntityTag.ASPECT.value, aspect.ref_id)
        statuses = await uow.get(AccessStatusRepository).find_all_for_entity(
            aspect_link
        )
        for status in statuses:
            if status.reason != AccessStatusReason.INHERITED:
                continue
            await uow.get(AccessStatusRepository).remove(ctx, status.ref_id)

    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        aspect: Aspect,
    ) -> None:
        """Clear inherited aspect-hierarchy statuses and re-replicate from the new path."""
        await self._clear_inherited_for_entity(ctx, uow, aspect)
        await self.replicate_for_entity(ctx, uow, aspect)

    async def refresh_for_aspect_and_descendants(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        aspect: Aspect,
    ) -> None:
        """Refresh inherited rights for an aspect and all nested child aspects."""
        await self.refresh_for_entity(ctx, uow, aspect)

        child_aspects = await uow.get_for(Aspect).find_all_generic(
            parent_ref_id=aspect.life_plan.ref_id,
            allow_archived=False,
            parent_aspect_ref_id=[aspect.ref_id],
        )
        for child_aspect in child_aspects:
            await self.refresh_for_aspect_and_descendants(ctx, uow, child_aspect)
