"""Service for listing users with reader access to a resource."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import AccessStatusRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork


class ReaderUserRefIdsForEntityService:
    """List users who have at least reader access to an entity."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        entity: EntityLink,
    ) -> list[EntityId]:
        """Return user ref ids with reader-or-better access from ACL status rows."""
        statuses = await uow.get(AccessStatusRepository).find_all_for_entity(
            entity,
        )
        return [
            status.user_ref_id
            for status in statuses
            if status.access_level.allows(AccessLevel.READER)
        ]
