"""Row in ``search_mutation_log``."""

import abc

from jupiter.core.search.mutation_log_status import SearchMutationLogStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, create_record_action, record
from jupiter.framework.storage.repository import RecordRepository


@record("SearchDomain")
class SearchMutationLogRecord(Record):
    """One deferred search indexing job keyed by mutation id."""

    search_domain: ParentLink
    mutation_id: MutationId
    status: SearchMutationLogStatus

    @staticmethod
    @create_record_action
    def new_unindexed(
        ctx: DomainContext,
        search_domain_ref_id: EntityId,
        mutation_id: MutationId,
    ) -> "SearchMutationLogRecord":
        """Build a row to enqueue with ``unindexed`` status."""
        return SearchMutationLogRecord._create(
            ctx,
            search_domain=ParentLink(search_domain_ref_id),
            mutation_id=mutation_id,
            status=SearchMutationLogStatus.UNINDEXED,
        )

    @property
    def raw_key(self) -> object:
        """Primary key for the mutation log row."""
        return self.mutation_id


class SearchMutationLogRecordRepository(
    RecordRepository[SearchMutationLogRecord, MutationId],
    abc.ABC,
):
    """Repository for :class:`SearchMutationLogRecord`."""

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
    async def remove_all_for_search_domain(
        self, search_domain_ref_id: EntityId
    ) -> None:
        """Remove every mutation-log row for a search domain (e.g. test teardown)."""
