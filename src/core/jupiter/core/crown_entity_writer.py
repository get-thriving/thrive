"""Writers for creating crown entities with ACL grants."""

from typing import Final, Protocol, TypeVar

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.service.grant_rights_to_user import (
    GrantRightsToUserService,
)
from jupiter.core.common.sub.access.sub.grant.service.replicate_parent_rights_for_entity import (
    ReplicateParentRightsForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.utils.generic_creator import generic_creator

_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class CrownEntityWriter(Protocol):
    """Create crown entities, granting access to a user."""

    async def create_entity(
        self,
        domain_context: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        user_id: EntityId,
        entity: _CrownEntityT,
        access_level: AccessLevel = AccessLevel.OWNER,
    ) -> _CrownEntityT:
        """Create a crown entity and grant the user access."""
        ...


class AclCrownEntityWriter:
    """Create crown entities and grant ACL to a user."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Construct a writer bound to the concept registry."""
        self._concept_registry = concept_registry

    async def create_entity(
        self,
        domain_context: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        user_id: EntityId,
        entity: _CrownEntityT,
        access_level: AccessLevel = AccessLevel.OWNER,
    ) -> _CrownEntityT:
        """Create a crown entity and grant the user access."""
        created = await generic_creator(uow, progress_reporter, entity)
        await self.grant_access_after_create(
            domain_context,
            uow,
            user_id,
            created,
            access_level,
        )
        return created

    async def grant_access_after_create(
        self,
        domain_context: DomainContext,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity: CrownEntity,
        access_level: AccessLevel,
    ) -> None:
        """Replicate parent rights and grant the user access to a newly created crown entity."""
        if isinstance(entity, LeafSupportEntity):
            return

        entity_type = type(entity)
        await ReplicateParentRightsForEntityService(self._concept_registry).do_it(
            domain_context, uow, entity
        )
        await GrantRightsToUserService(self._concept_registry).do_it(
            domain_context,
            uow,
            EntityLink.std(entity_type.__name__, entity.ref_id),
            user_id,
            access_level,
        )
