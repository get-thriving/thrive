"""Row in ``search_mutation_log``."""

from jupiter.core.search.mutation_log_status import SearchMutationLogStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import ParentLink
from jupiter.framework.record import Record, create_record_action, record


@record("Workspace")
class SearchMutationLogRecord(Record):
    """One deferred search indexing job keyed by mutation id."""

    workspace: ParentLink
    mutation_id: MutationId
    status: SearchMutationLogStatus

    @staticmethod
    @create_record_action
    def new_unindexed(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
        mutation_id: MutationId,
    ) -> "SearchMutationLogRecord":
        """Build a row to enqueue with ``unindexed`` status."""
        return SearchMutationLogRecord._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            mutation_id=mutation_id,
            status=SearchMutationLogStatus.UNINDEXED,
        )

    @property
    def raw_key(self) -> object:
        """Primary key for the mutation log row."""
        return self.mutation_id
