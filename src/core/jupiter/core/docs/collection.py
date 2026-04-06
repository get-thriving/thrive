"""The doc collection."""

import abc
from typing import TYPE_CHECKING

from jupiter.core.docs.root import Doc
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

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class DocCollection(TrunkEntity):
    """A doc collection."""

    workspace: ParentLink["Workspace"]

    docs = ContainsMany(Doc, doc_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_doc_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "DocCollection":
        """Create a inbox task collection."""
        return DocCollection._create(ctx, workspace=ParentLink(workspace_ref_id))


class DocCollectionRepository(TrunkEntityRepository[DocCollection], abc.ABC):
    """A repository of doc collections."""
