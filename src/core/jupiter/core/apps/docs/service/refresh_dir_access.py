"""Refresh access for a directory after grant changes on the parent-dir hierarchy."""

from jupiter.core.apps.docs.service.replicate_dir_hierarchy_rights import (
    ReplicateDirHierarchyRightsService,
)
from jupiter.core.apps.docs.sub.dir.root import Dir
from jupiter.core.common.sub.access.service.refresh_access_for_entity import (
    RefreshAccessForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class RefreshDirAccessService(RefreshAccessForEntityService):
    """Refresh inherited rights for a directory and its nested docs/dirs."""

    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity_ref_id: EntityId,
    ) -> None:
        """Load the directory and refresh it and all descendants."""
        dir_entity = await uow.get_for(Dir).load_by_id(entity_ref_id)
        await ReplicateDirHierarchyRightsService().refresh_for_dir_and_descendants(
            ctx,
            uow,
            dir_entity,
        )
