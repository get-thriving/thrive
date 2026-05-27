"""A metric."""

from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.metrics.direction import MetricDirection
from jupiter.core.metrics.name import MetricName
from jupiter.core.metrics.sub.entry.root import MetricEntry
from jupiter.core.metrics.unit import MetricUnit
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    BranchEntity,
    ContainsMany,
    IsEntityLinkStd,
    IsRefId,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("MetricCollection")
class Metric(BranchEntity):
    """A metric."""

    metric_collection: ParentLink
    name: MetricName
    is_key: bool
    icon: EntityIcon | None
    collection_params: RecurringTaskGenParams | None
    metric_unit: MetricUnit | None
    metric_direction: MetricDirection

    entries = ContainsMany(MetricEntry, metric_ref_id=IsRefId())
    collection_tasks = OwnsMany(
        InboxTask,
        owner=IsEntityLinkStd(NamedEntityTag.METRIC.value),
    )
    tag_link = OwnsAtMostOne(
        TagLink, owner=IsEntityLinkStd(NamedEntityTag.METRIC.value)
    )
    note = OwnsAtMostOne(Note, owner=IsEntityLinkStd(NamedEntityTag.METRIC.value))

    @staticmethod
    @create_entity_action
    def new_metric(
        ctx: DomainContext,
        metric_collection_ref_id: EntityId,
        name: MetricName,
        is_key: bool,
        icon: EntityIcon | None,
        collection_params: RecurringTaskGenParams | None,
        metric_unit: MetricUnit | None,
        metric_direction: MetricDirection,
    ) -> "Metric":
        """Create a metric."""
        return Metric._create(
            ctx,
            metric_collection=ParentLink(metric_collection_ref_id),
            name=name,
            is_key=is_key,
            icon=icon,
            collection_params=collection_params,
            metric_unit=metric_unit,
            metric_direction=metric_direction,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[MetricName],
        is_key: UpdateAction[bool],
        icon: UpdateAction[EntityIcon | None],
        collection_params: UpdateAction[RecurringTaskGenParams | None],
        metric_direction: UpdateAction[MetricDirection],
    ) -> "Metric":
        """Change the metric."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            is_key=is_key.or_else(self.is_key),
            icon=icon.or_else(self.icon),
            collection_params=collection_params.or_else(self.collection_params),
            metric_direction=metric_direction.or_else(self.metric_direction),
        )
