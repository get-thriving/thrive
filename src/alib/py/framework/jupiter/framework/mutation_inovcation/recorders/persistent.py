"""A persistent recorder for mutations."""

import abc
from contextlib import AbstractAsyncContextManager
from typing import Final

from jupiter.framework.mutation_inovcation.record import (
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

    async def clear_all(self, context_str: str) -> None:
        """Clear all invocation records for a given context."""
        async with self._storage_engine.get_unit_of_work() as uow:
            await uow.mutation_invocation_record_repository.clear_all(context_str)
