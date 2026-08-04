"""Service for loading a support entity while enforcing access control."""

from typing import Final, TypeVar

from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.find_workspace_for_entity import (
    FindWorkspaceForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import LeafSupportEntity, TrunkEntity
from jupiter.framework.storage.repository import DomainUnitOfWork

_TrunkEntityT = TypeVar("_TrunkEntityT", bound=TrunkEntity)
_LeafSupportEntityT = TypeVar("_LeafSupportEntityT", bound=LeafSupportEntity)


class LoadSupportEntityForAclService:
    """Load a leaf support entity rooted in the caller's workspace."""

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
        workspace_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load the entity if parent links lead to the caller's workspace.

        Support entities carry no access grants of their own. Reachability is
        membership in the caller's workspace: walk ParentLink ancestors until
        Workspace and require that workspace to be the caller's. Also require
        the entity to hang off the expected trunk for that workspace.
        """
        entity = await uow.get_for(entity_type).load_by_id(
            entity_ref_id, allow_archived=allow_archived
        )

        entity_workspace_ref_id = await FindWorkspaceForEntityService(
            self._concept_registry
        ).do_it(uow, entity)
        if entity_workspace_ref_id != workspace_ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"{entity_type.__name__} {entity_ref_id} does not belong to "
                f"workspace {workspace_ref_id}"
            )

        parent = await uow.get_for(parent_type).load_by_parent(workspace_ref_id)
        if entity.parent_ref_id != parent.ref_id:
            raise UserNotAllowedAccessToEntityError(
                f"{entity_type.__name__} {entity_ref_id} does not belong to "
                f"{entity_type.parent_type_name()} {parent.ref_id}"
            )

        return parent, entity
