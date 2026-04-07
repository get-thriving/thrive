"""A metric collection."""

from jupiter.core.metrics.root import Metric
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)


@entity("Workspace")
class MetricCollection(TrunkEntity):
    """A metric collection."""

    workspace: ParentLink

    metrics = ContainsMany(Metric, metric_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_metric_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "MetricCollection":
        """Create a metric collection."""
        return MetricCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
        )
