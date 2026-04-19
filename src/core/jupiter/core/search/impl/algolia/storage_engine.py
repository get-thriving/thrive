"""Algolia-backed search storage engine."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from dataclasses import dataclass
from types import TracebackType
from typing import Final

from algoliasearch.search_client import SearchClient
from algoliasearch.search_index import SearchIndex
from jupiter.core.env import Env
from jupiter.core.instance import Instance
from jupiter.core.search.impl.algolia.index_name import algolia_entities_index_name
from jupiter.core.search.impl.algolia.repository import AlgoliaSearchRepository
from jupiter.core.search.repository import SearchRepository
from jupiter.core.search.storage_engine import SearchStorageEngine, SearchUnitOfWork
from jupiter.core.universe import Universe
from jupiter.framework.realm.realm import RealmCodecRegistry


class AlgoliaSearchUnitOfWork(SearchUnitOfWork):
    """An Algolia-specific search unit of work."""

    _search_repository: Final[AlgoliaSearchRepository]

    def __init__(self, search_repository: AlgoliaSearchRepository) -> None:
        """Constructor."""
        self._search_repository = search_repository

    def __enter__(self) -> "AlgoliaSearchUnitOfWork":
        """Enter the context."""
        return self

    def __exit__(
        self,
        _exc_type: type[BaseException] | None,
        _exc_val: BaseException | None,
        _exc_tb: TracebackType | None,
    ) -> None:
        """Exit context."""

    @property
    def search_repository(self) -> SearchRepository:
        """The search repository."""
        return self._search_repository


@dataclass(frozen=True)
class AlgoliaSearchStorageEngineConfig:
    """Credentials and placement for Algolia entity search.

    ``write_api_key`` must be an API key with indexing (write) permission for the
    target index, not the search-only key.

    ``universe`` and ``env`` select the index name via ``algolia_entities_index_name``
    (same rule as ``infra/terraform.tf``). Callers will typically take these from
    global properties.

    ``instance`` identifies the running deployment for record filtering (see the
    Algolia repository); callers will typically use ``global_properties.instance``.
    """

    app_id: str
    write_api_key: str
    universe: Universe
    env: Env
    instance: Instance


class AlgoliaSearchStorageEngine(SearchStorageEngine):
    """An Algolia-specific search engine."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _config: Final[AlgoliaSearchStorageEngineConfig]
    _index: Final[SearchIndex]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        config: AlgoliaSearchStorageEngineConfig,
    ) -> None:
        """Constructor."""
        self._realm_codec_registry = realm_codec_registry
        self._config = config
        client = SearchClient.create(config.app_id, config.write_api_key)
        self._index = client.init_index(
            algolia_entities_index_name(config.universe, config.env)
        )

    async def initialize(self) -> None:
        """Initialize the storage engine (no schema step for Algolia)."""
        return

    @asynccontextmanager
    async def get_unit_of_work(self) -> AsyncIterator[SearchUnitOfWork]:
        """Get the unit of work."""
        search_repository = AlgoliaSearchRepository(
            self._realm_codec_registry,
            self._index,
            self._config.instance,
        )
        yield AlgoliaSearchUnitOfWork(search_repository=search_repository)
