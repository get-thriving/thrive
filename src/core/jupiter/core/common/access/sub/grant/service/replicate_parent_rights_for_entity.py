"""Service for replicating a parent's access rights onto a child entity."""

from typing import Final, cast

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.root import AccessDomainRepository
from jupiter.core.common.access.sub.grant.root import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
    AccessGrantRepository,
)
from jupiter.core.common.access.sub.status.reason import AccessStatusReason
from jupiter.core.common.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity
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
        """Walk up the shared parent path, inheriting each ancestor's grants for the entity."""
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

            grants = await uow.get(AccessGrantRepository).find_all_for_entity(
                parent_link
            )
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
                        access_domain.ref_id,
                        entity=child_link,
                        user_ref_id=grant.user_ref_id,
                        access_level=grant.access_level,
                        reason=AccessStatusReason.INHERITED,
                    )
                )

            parent_type = self._concept_registry.get_entity_by_name(parent_type_name)
            if not issubclass(parent_type, CrownEntity):
                break
            crown_parent_type = cast(type[CrownEntity], parent_type)
            current = await uow.get_for(crown_parent_type).load_by_id(parent_ref_id)
