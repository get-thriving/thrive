"""Service for revoking an access grant and its derived statuses."""

from typing import Final

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.root import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
    AccessGrant,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class RemoveGrantForEntityService:
    """Archive an access grant and remove statuses derived from it."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        acting_user_ref_id: EntityId,
        access_grant_ref_id: EntityId,
    ) -> None:
        """Archive the grant and remove all statuses derived from it."""
        grant = await uow.get_for(AccessGrant).load_by_id(
            access_grant_ref_id,
            allow_archived=False,
        )

        if grant.entity.the_type not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            raise InputValidationError(
                f"Entity type {grant.entity.the_type} does not support shared access"
            )

        entity_type = self._concept_registry.get_entity_by_name(grant.entity.the_type)
        if not issubclass(entity_type, CrownEntity) or issubclass(
            entity_type, LeafSupportEntity
        ):
            raise InputValidationError(
                f"Entity type {grant.entity.the_type} is not a crown entity"
            )

        if acting_user_ref_id != grant.user_ref_id:
            await CheckForAclService().do_it(
                uow,
                entity_type,
                grant.entity.ref_id,
                acting_user_ref_id,
                AccessLevel.OWNER,
                allow_archived=False,
            )

        if grant.access_level == AccessLevel.OWNER:
            raise InputValidationError("Cannot remove the owner's access grant")

        if grant.archived:
            raise InputValidationError("Access grant is already removed")

        archived_grant = grant.mark_archived(ctx, JupiterArchivalReason.USER)
        await uow.get_for(AccessGrant).save(archived_grant)

        statuses = await uow.get(AccessStatusRepository).find_all_for_grant(
            access_grant_ref_id,
        )
        status_repository = uow.get(AccessStatusRepository)
        for status in statuses:
            await status_repository.remove(status.raw_key)
