"""Service for loading the user that owns a resource."""

from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class LoadUserThatOwnsEntityService:
    """Load the owner of a resource as a :class:`UserLight`."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity: EntityLink,
    ) -> UserLight:
        """Return the user that owns the given entity."""
        owner_ref_ids_by_entity_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                [entity],
            )
        )
        owner_ref_id = owner_ref_ids_by_entity_ref_id.get(entity.ref_id)
        if owner_ref_id is None:
            raise InputValidationError(
                f"No owner user associated with entity '{entity}'"
            )
        users = await uow.get(UserRepository).find_all_light_by_ref_ids([owner_ref_id])
        if len(users) == 0:
            raise InputValidationError(
                f"Owner user '{owner_ref_id}' for entity '{entity}' does not exist"
            )
        return users[0]
