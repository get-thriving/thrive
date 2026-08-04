"""Service for resolving owner user ref ids for entities."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import AccessStatusRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork


class OwnerUserRefIdsForEntitiesService:
    """Map entity ref ids to their owner user ref ids."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entities: list[EntityLink],
    ) -> dict[EntityId, EntityId]:
        """Return a map from entity ref id to owner user ref id."""
        if not entities:
            return {}
        statuses = await uow.get(AccessStatusRepository).find_all_for_entities(entities)
        owner_ref_ids_by_entity_ref_id: dict[EntityId, EntityId] = {}
        for status in statuses:
            if status.access_level == AccessLevel.OWNER:
                owner_ref_ids_by_entity_ref_id[status.entity.ref_id] = (
                    status.user_ref_id
                )
        return owner_ref_ids_by_entity_ref_id
