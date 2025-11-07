"""The note collection."""

from jupiter.core.common.notes.root import Note
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)


@entity
class NoteCollection(TrunkEntity):
    """A note collection."""

    workspace: ParentLink

    notes = ContainsMany(Note, note_collection_ref_id=IsRefId())

    @staticmethod
    def new_note_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
    ) -> "NoteCollection":
        """Create a inbox task collection."""
        return NoteCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
