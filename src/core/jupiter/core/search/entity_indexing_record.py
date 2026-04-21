"""Persistent map of domain entities to search index object ids."""

from dataclasses import dataclass

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp


@dataclass(frozen=True)
class SearchEntityIndexingRecord:
    """One row in ``search_entity_indexing_map``."""

    workspace_ref_id: EntityId
    entity_type: str
    entity_ref_id: EntityId
    last_indexed_time: Timestamp
    object_id: str
