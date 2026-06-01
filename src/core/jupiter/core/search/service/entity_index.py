"""Index or remove a single crown entity in the search backend and indexing map."""

from typing import Final, Protocol

from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.root import NoteRepository
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.domain import SearchDomain
from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.core.search.indexing_storage_engine import SearchIndexingStorageEngine
from jupiter.core.search.storage_engine import SearchStorageEngine
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptRegistry
from jupiter.framework.entity import CrownEntity, ParentLink, StubEntity
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.time_provider import TimeProvider

ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER: Final[frozenset[str]] = frozenset(
    ("EmailTask", "SlackTask")
)

INDEX_METHOD_VERSION: Final[int] = 2


class SupportsSearchEntityIndexing(Protocol):
    """Subset of app ports required for search indexing."""

    @property
    def domain_storage_engine(self) -> DomainStorageEngine:
        """The domain storage engine."""
        ...

    @property
    def search_storage_engine(self) -> SearchStorageEngine:
        """The search storage engine."""
        ...

    @property
    def search_indexing_storage_engine(self) -> SearchIndexingStorageEngine:
        """The search indexing storage engine."""
        ...


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
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> str:
        """Load by type and id, upsert search, and persist the indexing map row."""
        if entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
            return ""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            search_domain = await uow.get_for(SearchDomain).load_by_id(
                search_domain_ref_id
            )
            if search_domain.workspace.ref_id != workspace_ref_id:
                raise ValueError(
                    f"Search domain {search_domain_ref_id} does not belong to workspace {workspace_ref_id}"
                )

            entity_cls = self._concept_registry.get_entity_by_name(entity_type)
            entity = await uow.get_for(entity_cls).load_by_id(
                entity_ref_id, allow_archived=True
            )
            if entity is None:
                raise ValueError(f"Entity {entity_type} {entity_ref_id} not found")
            if entity.__class__.__name__ not in NamedEntityTag:
                raise ValueError(
                    f"Entity {entity_type} is not a known named entity tag for search"
                )
            if not isinstance(entity, (CrownEntity, StubEntity)):
                raise ValueError(
                    f"Entity {entity_type} is not indexable as crown or stub"
                )
            if entity_type in ENTITY_TYPES_SKIPPED_BY_SEARCH_INDEXER:
                return ""
            note = await uow.get(NoteRepository).load_optional_for_owner(
                EntityLink.std(entity_type, entity_ref_id),
                allow_archived=True,
            )
            owner_link = EntityLink.std(entity_type, entity_ref_id)
            tag_link = await uow.get(TagLinkRepository).load_optional_for_owner(
                owner_link
            )
            contact_link = await uow.get(ContactLinkRepository).load_optional_for_owner(
                owner_link
            )
            tag_ref_ids = tag_link.ref_ids if tag_link is not None else []
            contact_ref_ids = (
                contact_link.contacts_ref_ids if contact_link is not None else []
            )
        resolved_type = entity.__class__.__name__
        async with self._ports.search_storage_engine.get_unit_of_work() as suow:
            object_id = await suow.search_repository.upsert(
                workspace_ref_id,
                search_domain_ref_id,
                entity,
                note,
                tag_ref_ids=tag_ref_ids,
                contact_ref_ids=contact_ref_ids,
            )
        indexed_at = self._time_provider.get_current_time()
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_entity_indexing_record_repository.upsert(
                SearchEntityIndexingRecord(
                    created_time=indexed_at,
                    last_modified_time=indexed_at,
                    search_domain=ParentLink(search_domain_ref_id),
                    entity_type=resolved_type,
                    entity_ref_id=entity.ref_id,
                    object_id=object_id,
                    index_method_version=INDEX_METHOD_VERSION,
                )
            )
        return object_id

    async def remove(
        self,
        *,
        workspace_ref_id: EntityId,
        search_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> None:
        """Remove from the search backend and drop the map row if one exists.

        Loads the indexing map row only; the domain entity may already be gone.
        """
        # Check that the search domain belongs to the workspace.
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            search_domain = await uow.get_for(SearchDomain).load_by_id(
                search_domain_ref_id
            )
            if search_domain.workspace.ref_id != workspace_ref_id:
                raise ValueError(
                    f"Search domain {search_domain_ref_id} does not belong to workspace {workspace_ref_id}"
                )
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            map_row = await iuow.search_entity_indexing_record_repository.load_optional(
                search_domain_ref_id, entity_type, entity_ref_id
            )
        if map_row is None:
            return
        async with self._ports.search_storage_engine.get_unit_of_work() as suow:
            await suow.search_repository.remove_by_object_id(
                workspace_ref_id,
                search_domain_ref_id,
                map_row.entity_type,
                map_row.entity_ref_id,
                map_row.object_id,
            )
        async with (
            self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
        ):
            await iuow.search_entity_indexing_record_repository.remove(
                (
                    search_domain_ref_id,
                    map_row.entity_type,
                    map_row.entity_ref_id,
                )
            )
