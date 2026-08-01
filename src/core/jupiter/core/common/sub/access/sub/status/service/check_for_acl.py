"""Service for checking access to an entity without loading it."""

from typing import TypeVar

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatusRepository,
    UserNotAllowedAccessToEntityError,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
)

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
            entities, user_ref_id
        )
        status_by_ref_id = {status.entity.ref_id: status for status in statuses}

        denied_ref_ids: list[EntityId] = []
        for entity_ref_id in entity_ref_ids:
            status = status_by_ref_id.get(entity_ref_id)
            if status is None or not status.access_level.allows(access_level):
                denied_ref_ids.append(entity_ref_id)

        if not denied_ref_ids:
            return

        # An entity that does not exist has no access status either, so being
        # denied is not enough to tell the two apart. Look the entities up so
        # that a missing one is reported as such instead of as a refusal.
        existing = await uow.get_for(entity_type).find_all_generic(
            allow_archived=True,
            ref_id=denied_ref_ids,
        )
        existing_ref_ids = {entity.ref_id for entity in existing}

        missing_ref_ids = [
            entity_ref_id
            for entity_ref_id in denied_ref_ids
            if entity_ref_id not in existing_ref_ids
        ]
        if missing_ref_ids:
            raise EntityNotFoundError(
                f"{entity_type.__name__} {missing_ref_ids[0]} does not exist"
            )

        raise UserNotAllowedAccessToEntityError(
            f"User {user_ref_id} is not allowed {access_level.value} access "
            f"to {entity_type.__name__} {denied_ref_ids[0]}"
        )
