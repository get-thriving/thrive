"""Repository for :class:`SearchMutationLogRecord`."""

import abc

from jupiter.core.search.mutation_log_record import SearchMutationLogRecord
from jupiter.core.search.mutation_log_status import SearchMutationLogStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.storage.repository import Repository


class SearchMutationLogRepository(Repository, abc.ABC):
    """Durable queue of mutations whose search indexing is deferred."""

    @abc.abstractmethod
    async def append_unindexed(self, record: SearchMutationLogRecord) -> None:
        """Insert a row, or no-op if ``mutation_id`` already exists (typically ``unindexed``)."""

    @abc.abstractmethod
    async def find_all_unindexed_ordered_by_created_time(
        self, limit: int, claim_at: Timestamp
    ) -> list[SearchMutationLogRecord]:
        """Claim up to ``limit`` oldest ``unindexed`` rows, set ``processing``, return them."""

    @abc.abstractmethod
    async def update_status(
        self,
        mutation_id: MutationId,
        status: SearchMutationLogStatus,
        *,
        last_modified_time: Timestamp,
    ) -> None:
        """Update ``status`` and ``last_modified_time`` for one row."""

    @abc.abstractmethod
    async def reset_all_processing_to_unindexed(self, at: Timestamp) -> int:
        """Set every ``processing`` row back to ``unindexed``; returns affected row count."""

    @abc.abstractmethod
    async def remove_all_for_workspace(self, workspace_ref_id: EntityId) -> None:
        """Remove every mutation-log row for a workspace (e.g. test teardown)."""
