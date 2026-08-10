"""Service for granting access rights over a resource (and its children) to a user."""

from typing import Final

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.root import AccessDomainRepository
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.principal_type import PrincipalType
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
    AccessGrantRepository,
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
from jupiter.framework.entity import (
    ContainsLink,
    CrownEntity,
    Entity,
    LeafSupportEntity,
    OwnsLink,
)
from jupiter.framework.storage.repository import DomainUnitOfWork


class GrantRightsToUserService:
    """Grant a user access to a resource, cascading inherited statuses to its children."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity: EntityLink,
        user: EntityId,
        access_level: AccessLevel,
    ) -> AccessGrant:
        """Grant the user the given access level over the resource and its children.

        Grants and statuses are upserted on ``(entity, principal, user)`` and
        ``(entity, user)`` respectively, so re-granting the same user is idempotent.
        """
        entity_type = self._concept_registry.get_entity_by_name(entity.the_type)
        if not issubclass(entity_type, CrownEntity) or issubclass(
            entity_type, LeafSupportEntity
        ):
            raise ValueError(
                f"Cannot grant access rights: entity {entity.the_type} is not a crown entity"
            )

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()

        grant = await uow.get(AccessGrantRepository).upsert(
            AccessGrant.new_access_grant(
                ctx,
                access_domain.ref_id,
                entity=entity,
                principal=PrincipalType.USER,
                user_ref_id=user,
                access_level=access_level,
            )
        )
        await uow.get(AccessStatusRepository).upsert(
            AccessStatus.new_access_status(
                ctx,
                access_domain.ref_id,
                entity=entity,
                user_ref_id=user,
                access_level=access_level,
                reason=AccessStatusReason.GRANT,
                access_grant_ref_id=grant.ref_id,
            )
        )

        root_entity = await uow.get_for(entity_type).load_by_id(entity.ref_id)
        await self._cascade_to_children(
            ctx,
            uow,
            access_domain.ref_id,
            root_entity,
            user,
            access_level,
            grant.ref_id,
        )
        return grant

    async def _cascade_to_children(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        access_domain_ref_id: EntityId,
        parent_entity: Entity,
        user: EntityId,
        access_level: AccessLevel,
        access_grant_ref_id: EntityId,
    ) -> None:
        """Follow contains/owns links, granting inherited statuses to children."""
        for field in parent_entity.__class__.__dict__.values():
            # ContainsLink covers metric entries / smart list items / stream
            # events; OwnsLink covers other owned crown children.
            if not isinstance(field, (ContainsLink, OwnsLink)):
                continue
            if not issubclass(field.the_type, CrownEntity):
                continue
            if issubclass(field.the_type, LeafSupportEntity):
                continue

            children = await uow.get_for(field.the_type).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                **field.get_for_entity(parent_entity),
            )

            for child in children:
                child_type = child.__class__.__name__
                if child_type in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
                    await uow.get(AccessStatusRepository).upsert(
                        AccessStatus.new_access_status(
                            ctx,
                            access_domain_ref_id,
                            entity=EntityLink.std(child_type, child.ref_id),
                            user_ref_id=user,
                            access_level=access_level,
                            reason=AccessStatusReason.INHERITED,
                            access_grant_ref_id=access_grant_ref_id,
                        )
                    )
                await self._cascade_to_children(
                    ctx,
                    uow,
                    access_domain_ref_id,
                    child,
                    user,
                    access_level,
                    access_grant_ref_id,
                )
