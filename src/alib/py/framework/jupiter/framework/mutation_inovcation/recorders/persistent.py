"""A persistent recorder for mutations."""

import abc
from contextlib import AbstractAsyncContextManager
from typing import Final

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.mutation_inovcation.invocation_record import (
    MutationInvocationRecord,
)
from jupiter.framework.mutation_inovcation.recorder import (
    MutationInvocationRecorder,
)
from jupiter.framework.storage.repository import Repository


class MutationInvocationRecordRepository(Repository, abc.ABC):
    """A repository for mutation use cases invocation records."""

    @abc.abstractmethod
    async def create(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Create a new invocation record."""

    @abc.abstractmethod
    async def find_all(
        self,
        mutation_ids: list[MutationId],
    ) -> list[MutationInvocationRecord]:
        """Find all invocation records matching the given mutation ids."""

    @abc.abstractmethod
    async def find_all_entity_events_by_timestamp_desc(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> list[MutationEntityEvent]:
        """Find all entity events in descending timestamp order."""

    @abc.abstractmethod
    async def find_all_entity_events_for_mutation(
        self,
        mutation_id: MutationId,
    ) -> list[MutationEntityEvent]:
        """Find all entity events for a given mutation id."""

    @abc.abstractmethod
    async def find_all_invocation_records_by_context_str(
        self,
        context_str: str,
        offset: int,
        limit: int,
    ) -> tuple[list[MutationInvocationRecord], int]:
        """Find all invocation records for a given context with pagination."""

    @abc.abstractmethod
    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation record entries."""


class MutationInvocationUnitOfWork(abc.ABC):
    """A transactional unit of work from an engine."""

    @property
    @abc.abstractmethod
    def mutation_invocation_record_repository(
        self,
    ) -> MutationInvocationRecordRepository:
        """The mutation use case invocation record repository."""


class MutationInvocationStorageEngine(abc.ABC):
    """A storage engine of some form."""

    @abc.abstractmethod
    def get_unit_of_work(
        self,
    ) -> AbstractAsyncContextManager[MutationInvocationUnitOfWork]:
        """Build a unit of work."""


class PersistentMutationInvocationRecorder(MutationInvocationRecorder):
    """A mutation invocation recorder which persists the records to storage."""

    _storage_engine: Final[MutationInvocationStorageEngine]

    def __init__(self, storage_engine: MutationInvocationStorageEngine) -> None:
        """Constructor."""
        self._storage_engine = storage_engine

    async def record(
        self,
        invocation_record: MutationInvocationRecord,
    ) -> None:
        """Record the invocation of the use case."""
        async with self._storage_engine.get_unit_of_work() as uow:
            await uow.mutation_invocation_record_repository.create(
                invocation_record,
            )

    async def find_all_invocation_records(
        self,
        mutation_ids: list[MutationId],
    ) -> list[MutationInvocationRecord]:
        """Retrieve all mutation records."""
        if not mutation_ids:
            return []
        async with self._storage_engine.get_unit_of_work() as uow:
            return await uow.mutation_invocation_record_repository.find_all(
                mutation_ids,
            )

    async def find_all_entity_events_by_timestamp_desc(
        self,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> list[MutationEntityEvent]:
        """Retrieve all events on an entity ordered by timestamp descending."""
        async with self._storage_engine.get_unit_of_work() as uow:
            return await uow.mutation_invocation_record_repository.find_all_entity_events_by_timestamp_desc(
                entity_type,
                entity_ref_id,
            )

    async def find_all_entity_events_for_mutation(
        self,
        mutation_id: MutationId,
    ) -> list[MutationEntityEvent]:
        """Retrieve all entity events for a given mutation id."""
        async with self._storage_engine.get_unit_of_work() as uow:
            return await uow.mutation_invocation_record_repository.find_all_entity_events_for_mutation(
                mutation_id,
            )

    async def find_all_invocation_records_by_context_str(
        self,
        context_str: str,
        offset: int,
        limit: int,
    ) -> tuple[list[MutationInvocationRecord], int]:
        """Retrieve all invocation records for a given context with pagination."""
        async with self._storage_engine.get_unit_of_work() as uow:
            return await uow.mutation_invocation_record_repository.find_all_invocation_records_by_context_str(
                context_str,
                offset,
                limit,
            )

    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
        async with self._storage_engine.get_unit_of_work() as uow:
            await uow.mutation_invocation_record_repository.clear_all(context_str)
