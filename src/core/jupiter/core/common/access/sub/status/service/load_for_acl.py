"""Service for loading an entity while enforcing access control."""

from typing import TypeVar

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.framework.base.entity_id import EntityId
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
        await CheckForAclService().do_it(
            uow,
            entity_type,
            entity_ref_id,
            user_ref_id,
            access_level,
            allow_archived=allow_archived,
        )
        return await uow.get_for(entity_type).load_by_id(
            entity_ref_id, allow_archived=allow_archived
        )
