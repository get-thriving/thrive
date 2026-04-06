"""The note collection."""

from typing import TYPE_CHECKING

from jupiter.core.common.sub.notes.root import Note
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    entity,
)

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class NoteCollection(TrunkEntity):
    """A note collection."""

    workspace: ParentLink["Workspace"]

    notes = ContainsMany(Note, note_collection_ref_id=IsRefId())

    @staticmethod
    def new_note_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "NoteCollection":
        """Create a inbox task collection."""
        return NoteCollection._create(ctx, workspace=ParentLink(workspace_ref_id))
