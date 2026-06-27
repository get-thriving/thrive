"""Service for checking access to an entity without loading it."""

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


class CheckForAclService:
    """Check that a user has the required access level over an entity."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity_type: type[_CrownEntityT],
        entity_ref_id: EntityId,
        user_ref_id: EntityId,
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> None:
        """Check the user's access status, or raise if not allowed."""
        await self.do_it_for_many(
            uow,
            entity_type,
            [entity_ref_id],
            user_ref_id,
            access_level,
            allow_archived=allow_archived,
        )

    async def do_it_for_many(
        self,
        uow: DomainUnitOfWork,
        entity_type: type[_CrownEntityT],
        entity_ref_ids: list[EntityId],
        user_ref_id: EntityId,
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> None:
        """Check the user's access status for each entity, or raise if not allowed."""
        if not entity_ref_ids:
            return

        entities = [
            EntityLink.std(entity_type.__name__, ref_id) for ref_id in entity_ref_ids
        ]
        statuses = await uow.get(AccessStatusRepository).load_all_for_entities_and_user(
            entities, user_ref_id, allow_archived=allow_archived
        )
        status_by_ref_id = {status.entity.ref_id: status for status in statuses}

        for entity_ref_id in entity_ref_ids:
            status = status_by_ref_id.get(entity_ref_id)
            if status is None or not status.access_level.allows(access_level):
                raise UserNotAllowedAccessToEntityError(
                    f"User {user_ref_id} is not allowed {access_level.value} access "
                    f"to {entity_type.__name__} {entity_ref_id}"
                )
