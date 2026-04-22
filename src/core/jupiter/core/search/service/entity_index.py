"""Index or remove a single crown entity in the search backend and indexing map."""

from dataclasses import dataclass
from typing import Final, Protocol

from jupiter.core.common.sub.notes.root import NoteRepository
from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.core.search.indexing_storage_engine import SearchIndexingStorageEngine
from jupiter.core.search.storage_engine import SearchStorageEngine
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.time_provider import TimeProvider

ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER: Final[frozenset[str]] = frozenset(
    ("EmailTask", "SlackTask")
)


@dataclass(frozen=True)
class SupportsSearchEntityIndexing(Protocol):
    """Subset of app ports required for search indexing."""

    domain_storage_engine: DomainStorageEngine
    search_storage_engine: SearchStorageEngine
    search_indexing_storage_engine: SearchIndexingStorageEngine


class SearchEntityIndexService:
    """Loads domain data, updates the search index, and mirrors state in the map."""

    _ports: Final[SupportsSearchEntityIndexing]
    _concept_registry: Final[ConceptRegistry]
    _time_provider: Final[TimeProvider]

    def __init__(
        self,
        ports: SupportsSearchEntityIndexing,
        concept_registry: ConceptRegistry,
        time_provider: TimeProvider,
    ) -> None:
        """Constructor."""
        self._ports = ports
        self._concept_registry = concept_registry
        self._time_provider = time_provider

    async def index(
        self,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> str:
        """Load by type and id, upsert search, and persist the indexing map row."""
        if entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
            return ""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            entity_cls = self._concept_registry.get_entity_by_name(entity_type)
            entity = await uow.get_for(entity_cls).load_by_id(
                entity_ref_id, allow_archived=True
            )
            if not isinstance(entity, CrownEntity):
                raise ValueError(f"Entity {entity_type} is not a crown entity")
            note = await uow.get(NoteRepository).load_optional_for_owner(
                EntityLink.std(entity_type, entity_ref_id),
                allow_archived=True,
            )
        resolved_type = entity.__class__.__name__
        async with self._ports.search_storage_engine.get_unit_of_work() as suow:
            object_id = await suow.search_repository.upsert(
                workspace_ref_id, entity, note
            )
        indexed_at = self._time_provider.get_current_time()
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_entity_indexing_map_repository.upsert(
                SearchEntityIndexingRecord(
                    workspace_ref_id=workspace_ref_id,
                    entity_type=resolved_type,
                    entity_ref_id=entity.ref_id,
                    last_indexed_time=indexed_at,
                    object_id=object_id,
                )
            )
        return object_id

    async def remove(
        self,
        *,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> None:
        """Remove from the search backend and drop the map row if one exists.

        Loads the indexing map row only; the domain entity may already be gone.
        """
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            map_row = await iuow.search_entity_indexing_map_repository.load_optional(
                workspace_ref_id, entity_type, entity_ref_id
            )
        if map_row is None:
            return
        async with self._ports.search_storage_engine.get_unit_of_work() as suow:
            await suow.search_repository.remove_by_object_id(
                workspace_ref_id,
                map_row.entity_type,
                map_row.entity_ref_id,
                map_row.object_id,
            )
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_entity_indexing_map_repository.remove(
                workspace_ref_id, map_row.entity_type, map_row.entity_ref_id
            )
