"""Service for loading an entity while enforcing access control."""

from typing import TypeVar

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.status.root import (
    AccessStatusRepository,
    UserNotAllowedAccessToEntityError,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import DomainUnitOfWork

_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class LoadForAclService:
    """Load an entity for a user, enforcing the required access level over it."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity_type: type[_CrownEntityT],
        entity_ref_id: EntityId,
        user_ref_id: EntityId,
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Check the user's access status and load the entity, or raise if not allowed."""
        entity = EntityLink.std(entity_type.__name__, entity_ref_id)
        status = await uow.get(
            AccessStatusRepository
        ).load_optional_for_entity_and_user(entity, user_ref_id)
        if status is None or not status.access_level.allows(access_level):
            raise UserNotAllowedAccessToEntityError(
                f"User {user_ref_id} is not allowed {access_level.value} access "
                f"to {entity_type.__name__} {entity_ref_id}"
            )
        return await uow.get_for(entity_type).load_by_id(
            entity_ref_id, allow_archived=allow_archived
        )
