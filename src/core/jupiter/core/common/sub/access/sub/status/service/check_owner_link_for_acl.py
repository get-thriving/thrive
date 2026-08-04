"""Check a user's access over the entity an owner link points at."""

from typing import Final, cast

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.find_workspace_for_entity import (
    FindWorkspaceForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptNotFoundError, ConceptRegistry
from jupiter.framework.entity import (
    AboveGroundEntity,
    CrownEntity,
    LeafSupportEntity,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityRepository


class CheckOwnerLinkForAclService:
    """Check a user's access over the entity an owner link points at."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        owner: EntityLink,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        access_level: AccessLevel,
        allowed_owner_types: frozenset[str],
        require_in_caller_workspace: bool = False,
    ) -> EntityId:
        """Check the user's access over the owner, and find the workspace holding it.

        When ``require_in_caller_workspace`` is set, the owner must also sit in
        the caller's workspace. Use that for per-workspace namespaces (tags,
        contacts); leave it off when a shared entity may live elsewhere (notes).
        """
        if owner.the_type not in allowed_owner_types:
            raise InputValidationError(f"Invalid owner entity type: {owner.the_type!r}")

        try:
            entity_type = self._concept_registry.get_entity_by_name(owner.the_type)
        except ConceptNotFoundError as err:
            raise InputValidationError(
                f"Unknown entity type {owner.the_type!r}"
            ) from err

        if not issubclass(entity_type, AboveGroundEntity):
            raise InputValidationError(
                f"Entity type {owner.the_type} cannot own a support record"
            )

        owner_entity = await cast(
            EntityRepository[AboveGroundEntity],
            uow.get_for(entity_type),  # type: ignore[call-overload]
        ).load_by_id(owner.ref_id, allow_archived=True)

        owner_workspace_ref_id = await FindWorkspaceForEntityService(
            self._concept_registry
        ).do_it(uow, owner_entity)

        if issubclass(entity_type, CrownEntity) and not issubclass(
            entity_type, LeafSupportEntity
        ):
            await CheckForAclService().do_it(
                uow,
                entity_type,
                owner.ref_id,
                user_ref_id,
                access_level,
                allow_archived=True,
            )
        elif owner_workspace_ref_id != caller_workspace_ref_id:
            # Stub entities such as WorkingMem carry no access grants and cannot
            # be shared, so sitting in the caller's own workspace is the only
            # form of access there is to check.
            raise UserNotAllowedAccessToEntityError(
                f"User {user_ref_id} is not allowed {access_level.value} access "
                f"to {entity_type.__name__} {owner.ref_id}"
            )

        if (
            require_in_caller_workspace
            and owner_workspace_ref_id != caller_workspace_ref_id
        ):
            raise UserNotAllowedAccessToEntityError(
                f"{entity_type.__name__} {owner.ref_id} does not belong to "
                f"workspace {caller_workspace_ref_id}"
            )

        return owner_workspace_ref_id
