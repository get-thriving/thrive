"""The doc collection."""

from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity
class DocCollection(TrunkEntity):
    """A doc collection."""

    workspace: ParentLink

    docs = ContainsMany(Doc, doc_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_doc_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "DocCollection":
        """Create a inbox task collection."""
        return DocCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
