"""Search domain trunk entity."""

from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.core.search.mutation_log_record import SearchMutationLogRecord
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.record import ContainsManyRecords


@entity("Workspace")
class SearchDomain(TrunkEntity):
    """Search trunk entity."""

    workspace: ParentLink

    entity_indexing_records = ContainsManyRecords(
        SearchEntityIndexingRecord, search_domain_ref_id=IsRefId()
    )
    mutation_log_records = ContainsManyRecords(
        SearchMutationLogRecord, search_domain_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_search_domain(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "SearchDomain":
        """Create a search domain."""
        return SearchDomain._create(ctx, workspace=ParentLink(workspace_ref_id))
