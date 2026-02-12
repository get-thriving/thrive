"""A metric entry."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class MetricEntry(LeafEntity):
    """A metric entry."""

    metric: ParentLink
    collection_time: ADate
    value: float

    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.METRIC_ENTRY, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.METRIC_ENTRY, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_metric_entry(
        ctx: MutationContext,
        metric_ref_id: EntityId,
        collection_time: ADate,
        value: float,
    ) -> "MetricEntry":
        """Create a metric entry."""
        return MetricEntry._create(
            ctx,
            name=MetricEntry.build_name(collection_time, value),
            metric=ParentLink(metric_ref_id),
            collection_time=collection_time,
            value=value,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        collection_time: UpdateAction[ADate],
        value: UpdateAction[float],
    ) -> "MetricEntry":
        """Change the metric entry."""
        return self._new_version(
            ctx,
            name=MetricEntry.build_name(
                collection_time.or_else(self.collection_time), value.or_else(self.value)
            ),
            collection_time=collection_time.or_else(self.collection_time),
            value=value.or_else(self.value),
        )

    @staticmethod
    def build_name(collection_time: ADate, value: float) -> EntityName:
        """Construct a name."""
        return EntityName(
            f"Entry for {collection_time} value={value}",
        )
