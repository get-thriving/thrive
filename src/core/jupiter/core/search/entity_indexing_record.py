"""Persistent map of domain entities to search index object ids."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, record


@record("Workspace")
class SearchEntityIndexingRecord(Record):
    """One row in ``search_entity_indexing_map``."""

    workspace: ParentLink
    entity_type: str
    entity_ref_id: EntityId
    object_id: str

    @property
    def raw_key(self) -> object:
        """Stable composite key for this map row."""
        return (self.workspace.ref_id, self.entity_type, self.entity_ref_id)
