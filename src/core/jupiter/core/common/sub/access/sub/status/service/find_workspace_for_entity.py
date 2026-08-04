"""Find the workspace an entity sits in by walking its parents."""

from typing import Final, cast

from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import AboveGroundEntity, RootEntity
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityRepository


class FindWorkspaceForEntityService:
    """Find the workspace an entity sits in by walking its parents."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity: AboveGroundEntity,
    ) -> EntityId:
        """Load ancestors until reaching the workspace that holds the entity."""
        current = entity
        while True:
            parent_type = self._concept_registry.get_entity_by_name(
                current.parent_type_name()
            )

            if issubclass(parent_type, RootEntity):
                if parent_type is not Workspace:
                    raise InputValidationError(
                        f"{entity.__class__.__name__} {entity.ref_id} is held by "
                        f"{parent_type.__name__} rather than a workspace"
                    )
                return current.parent_ref_id

            # get_for is overloaded per entity kind while the registry only knows
            # the union of them, and every kind loads by id off the same base.
            repository = cast(
                EntityRepository[AboveGroundEntity],
                uow.get_for(parent_type),  # type: ignore[call-overload]
            )
            current = await repository.load_by_id(
                current.parent_ref_id, allow_archived=True
            )
