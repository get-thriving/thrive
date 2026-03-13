"""A metric collection."""

from jupiter.core.metrics.root import Metric
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)


@entity
class MetricCollection(TrunkEntity):
    """A metric collection."""

    workspace: ParentLink
    collection_aspect_ref_id: EntityId

    metrics = ContainsMany(Metric, metric_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_metric_collection(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
        collection_aspect_ref_id: EntityId,
    ) -> "MetricCollection":
        """Create a metric collection."""
        return MetricCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            collection_aspect_ref_id=collection_aspect_ref_id,
        )

    @update_entity_action
    def change_collection_aspect(
        self,
        ctx: MutationContext,
        collection_aspect_ref_id: EntityId,
    ) -> "MetricCollection":
        """Change the catch up aspect."""
        return self._new_version(
            ctx,
            collection_aspect_ref_id=collection_aspect_ref_id,
        )
