"""Service for loading a user's access status over a resource."""

from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
    UserNotAllowedAccessToEntityError,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork


class GetAccessLevelForEntityService:
    """Load the access status of a user over a resource."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity: EntityLink,
        user_ref_id: EntityId,
    ) -> AccessStatus:
        """Return the user's access status for the given entity."""
        status = await uow.get(
            AccessStatusRepository
        ).load_optional_for_entity_and_user(
            entity,
            user_ref_id,
        )
        if status is not None:
            return status

        raise UserNotAllowedAccessToEntityError(
            f"User {user_ref_id} has no access to entity '{entity}'"
        )
