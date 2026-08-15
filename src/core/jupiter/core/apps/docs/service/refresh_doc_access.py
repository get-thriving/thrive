"""Refresh access for a doc after grant changes on the parent-dir hierarchy."""

from jupiter.core.apps.docs.service.replicate_dir_hierarchy_rights import (
    ReplicateDirHierarchyRightsService,
)
from jupiter.core.apps.docs.sub.doc.root import Doc
from jupiter.core.common.sub.access.service.refresh_access_for_entity import (
    RefreshAccessForEntityService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class RefreshDocAccessService(RefreshAccessForEntityService):
    """Refresh inherited rights for a single doc from its parent-dir chain."""

    async def refresh_for_entity(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        entity_ref_id: EntityId,
    ) -> None:
        """Load the doc and reconcile GRANT + INHERITED statuses."""
        doc = await uow.get_for(Doc).load_by_id(entity_ref_id)
        await ReplicateDirHierarchyRightsService().refresh_for_entity(ctx, uow, doc)
