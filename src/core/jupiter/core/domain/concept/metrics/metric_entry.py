"""A metric entry."""

from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework_new.update_action import UpdateAction


@entity
class MetricEntry(LeafEntity):
    """A metric entry."""

    metric: ParentLink
    collection_time: ADate
    value: float

    note = OwnsAtMostOne(
        Note, domain=NoteDomain.METRIC_ENTRY, source_entity_ref_id=IsRefId()
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
