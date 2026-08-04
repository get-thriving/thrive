"""Services for removing access control data scoped to a workspace or user."""

from collections.abc import Awaitable, Callable
from typing import Final, cast

from jupiter.core.common.sub.access.root import (
    THE_ACCESS_DOMAIN_REF_ID,
)
from jupiter.core.common.sub.access.sub.grant.root import AccessGrant
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatusRepository,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    AboveGroundEntity,
    CrownEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
    RecordNotFoundError,
)


class RemoveAccessForWorkspaceAndUserService:
    """Remove access grants and statuses for a workspace and/or user."""

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    async def remove_for_workspace(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
    ) -> None:
        """Remove all grants and statuses for entities in the given workspace."""
        entity_belongs_to_workspace = self._build_entity_belongs_to_workspace(
            uow,
            workspace_ref_id,
        )

        async def should_remove(_user_ref_id: EntityId, entity: EntityLink) -> bool:
            return await entity_belongs_to_workspace(entity)

        await self._remove_matching(ctx, uow, should_remove)

    async def remove_for_user(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
    ) -> None:
        """Remove all grants and statuses granted to the given user."""

        async def should_remove(
            grant_user_ref_id: EntityId, _entity: EntityLink
        ) -> bool:
            return grant_user_ref_id == user_ref_id

        await self._remove_matching(ctx, uow, should_remove)

    async def _remove_matching(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        should_remove: Callable[[EntityId, EntityLink], Awaitable[bool]],
    ) -> None:
        statuses = await uow.get(AccessStatusRepository).find_all(
            THE_ACCESS_DOMAIN_REF_ID,
        )
        grants = await uow.get_for(AccessGrant).find_all(
            THE_ACCESS_DOMAIN_REF_ID,
            allow_archived=True,
        )

        status_repository = uow.get(AccessStatusRepository)
        grant_repository = uow.get_for(AccessGrant)

        for status in statuses:
            if await should_remove(status.user_ref_id, status.entity):
                try:
                    await status_repository.remove(status.raw_key)
                except RecordNotFoundError:
                    continue

        for grant in grants:
            if await should_remove(grant.user_ref_id, grant.entity):
                try:
                    await grant_repository.remove(ctx, grant.ref_id)
                except EntityNotFoundError:
                    continue

    def _build_entity_belongs_to_workspace(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
    ) -> Callable[[EntityLink], Awaitable[bool]]:
        cache: dict[EntityLink, bool] = {}

        async def entity_belongs_to_workspace(entity: EntityLink) -> bool:
            if entity in cache:
                return cache[entity]
            result = await self._entity_belongs_to_workspace(
                uow,
                entity,
                workspace_ref_id,
            )
            cache[entity] = result
            return result

        return entity_belongs_to_workspace

    async def _entity_belongs_to_workspace(
        self,
        uow: DomainUnitOfWork,
        entity: EntityLink,
        workspace_ref_id: EntityId,
    ) -> bool:
        entity_type = self._concept_registry.get_entity_by_name(entity.the_type)
        if not issubclass(entity_type, CrownEntity):
            return False

        crown_entity_type = cast(type[CrownEntity], entity_type)
        current: CrownEntity | StubEntity | TrunkEntity
        try:
            current = await uow.get_for(crown_entity_type).load_by_id(
                entity.ref_id,
                allow_archived=True,
            )
        except EntityNotFoundError:
            return False

        current_type: type[AboveGroundEntity | Workspace] = crown_entity_type
        while True:
            if current_type is Workspace:
                return current.ref_id == workspace_ref_id
            if not issubclass(current_type, AboveGroundEntity):
                return False

            parent_type_name = current_type.parent_type_name()
            parent_type = self._concept_registry.get_entity_by_name(parent_type_name)
            if parent_type is Workspace:
                try:
                    parent = await uow.get_for(Workspace).load_by_id(
                        current.parent_ref_id,
                        allow_archived=True,
                    )
                except EntityNotFoundError:
                    return False
                return parent.ref_id == workspace_ref_id

            if not issubclass(parent_type, CrownEntity | StubEntity | TrunkEntity):
                return False

            parent_entity_type = cast(
                type[CrownEntity] | type[StubEntity] | type[TrunkEntity],
                parent_type,
            )
            try:
                current = await uow.get_for(parent_entity_type).load_by_id(
                    current.parent_ref_id,
                    allow_archived=True,
                )
            except EntityNotFoundError:
                return False
            current_type = parent_entity_type
