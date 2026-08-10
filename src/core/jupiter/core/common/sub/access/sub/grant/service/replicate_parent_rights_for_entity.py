"""Service for replicating a parent's access rights onto a child entity."""

from typing import Final, cast

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.root import AccessDomainRepository
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrantRepository,
)
from jupiter.core.common.sub.access.sub.grant.service.find_shareable_owns_parents import (
    FindShareableOwnsParentsService,
)
from jupiter.core.common.sub.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.storage.repository import DomainUnitOfWork


class ReplicateParentRightsForEntityService:
    """Replicate the access rights of shared ancestors onto a child entity."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: CrownEntity,
    ) -> None:
        """Walk shareable parents, inheriting each ancestor's grants for the entity."""
        if issubclass(entity.__class__, LeafSupportEntity):
            raise ValueError(
                f"Cannot replicate access rights: entity {entity.__class__.__name__} "
                "is a leaf-support entity, not a shareable crown entity"
            )

        child_type = entity.__class__.__name__
        if child_type not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            return

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        child_link = EntityLink.std(child_type, entity.ref_id)

        # A child only ever has one effective status per user, so the closest
        # ancestor that grants a user access wins.
        seen_users: set[EntityId] = set()
        current: CrownEntity = entity

        while True:
            parent_type_name = current.__class__.parent_type_name()
            if parent_type_name not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
                # Reached an ancestor that isn't shared like this; stop.
                break

            parent_ref_id = current.parent_ref_id
            parent_link = EntityLink.std(parent_type_name, parent_ref_id)

            await self._inherit_grants_from(
                ctx,
                uow,
                access_domain.ref_id,
                child_link,
                parent_link,
                seen_users,
            )

            parent_type = self._concept_registry.get_entity_by_name(parent_type_name)
            if not issubclass(parent_type, CrownEntity):
                break
            crown_parent_type = cast(type[CrownEntity], parent_type)
            current = await uow.get_for(crown_parent_type).load_by_id(parent_ref_id)

        # Also inherit from shareable OwnsLink/ContainsLink parents that are not
        # the framework ParentLink (e.g. schedule stream → events).
        for owns_parent in FindShareableOwnsParentsService(
            self._concept_registry
        ).find_for_entity(entity):
            await self._inherit_grants_from(
                ctx,
                uow,
                access_domain.ref_id,
                child_link,
                owns_parent,
                seen_users,
            )

    async def _inherit_grants_from(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        access_domain_ref_id: EntityId,
        child_link: EntityLink,
        source_link: EntityLink,
        seen_users: set[EntityId],
    ) -> None:
        grants = await uow.get(AccessGrantRepository).find_all_for_entity(source_link)
        for grant in grants:
            if grant.access_level == AccessLevel.OWNER:
                # Ownership is not inherited downward.
                continue
            if grant.user_ref_id in seen_users:
                continue
            seen_users.add(grant.user_ref_id)
            await uow.get(AccessStatusRepository).upsert(
                AccessStatus.new_access_status(
                    ctx,
                    access_domain_ref_id,
                    entity=child_link,
                    user_ref_id=grant.user_ref_id,
                    access_level=grant.access_level,
                    reason=AccessStatusReason.INHERITED,
                    access_grant_ref_id=grant.ref_id,
                )
            )
