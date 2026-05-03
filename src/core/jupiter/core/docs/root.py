"""The doc collection."""

import abc

from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.storage.repository import TrunkEntityRepository


@entity("Workspace")
class DocCollection(TrunkEntity):
    """A doc collection."""

    workspace: ParentLink

    docs = ContainsMany(Doc, doc_collection_ref_id=IsRefId())
    dirs = ContainsMany(Dir, doc_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_doc_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "DocCollection":
        """Create a doc collection."""
        return DocCollection._create(ctx, workspace=ParentLink(workspace_ref_id))


class DocCollectionRepository(TrunkEntityRepository[DocCollection], abc.ABC):
    """A repository of doc collections."""
