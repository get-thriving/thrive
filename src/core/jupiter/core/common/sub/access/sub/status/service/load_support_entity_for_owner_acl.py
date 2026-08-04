"""Load a support entity via the ACL of the entity it describes."""

from typing import Final, Protocol, TypeVar

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.check_owner_link_for_acl import (
    CheckOwnerLinkForAclService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import LeafSupportEntity, TrunkEntity
from jupiter.framework.storage.repository import DomainUnitOfWork

_TrunkEntityT = TypeVar("_TrunkEntityT", bound=TrunkEntity)
_LeafSupportEntityT = TypeVar("_LeafSupportEntityT", bound=LeafSupportEntity)


class _OwnerLinkedLeafSupportEntity(Protocol):
    """A leaf support entity that points at the crown (or stub) it describes."""

    @property
    def owner(self) -> EntityLink: ...

    @property
    def parent_ref_id(self) -> EntityId: ...

    @property
    def ref_id(self) -> EntityId: ...


class LoadSupportEntityForOwnerAclService:
    """Load a support entity after checking access on the entity it describes."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        entity_ref_id: EntityId,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load the support entity, gate on its owner, and prove it sits in that trunk."""
        entity = await uow.get_for(entity_type).load_by_id(
            entity_ref_id, allow_archived=allow_archived
        )
        owner_linked: _OwnerLinkedLeafSupportEntity = entity  # type: ignore[assignment]

        owner_workspace_ref_id = await CheckOwnerLinkForAclService(
            self._concept_registry
        ).do_it(
            uow,
            owner_linked.owner,
            user_ref_id,
            caller_workspace_ref_id,
            access_level,
            allowed_owner_types,
        )

        parent = await uow.get_for(parent_type).load_by_parent(owner_workspace_ref_id)
        if owner_linked.parent_ref_id != parent.ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"{entity_type.__name__} {entity_ref_id} does not belong to "
                f"{entity_type.parent_type_name()} {parent.ref_id}"
            )

        return parent, entity
