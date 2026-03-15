"""A calendar export configuration."""

from jupiter.core.schedule.sub.export.name import ScheduleExportName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity
class ScheduleExport(LeafEntity):
    """A calendar export configuration that bundles multiple schedule streams."""

    schedule_domain: ParentLink

    name: ScheduleExportName
    schedule_stream_ref_ids: list[EntityId]

    @staticmethod
    @create_entity_action
    def new_schedule_export(
        ctx: MutationContext,
        schedule_domain_ref_id: EntityId,
        name: ScheduleExportName,
        schedule_stream_ref_ids: list[EntityId],
    ) -> "ScheduleExport":
        """Create a new schedule export."""
        return ScheduleExport._create(
            ctx,
            schedule_domain=ParentLink(schedule_domain_ref_id),
            name=name,
            schedule_stream_ref_ids=schedule_stream_ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[ScheduleExportName],
        schedule_stream_ref_ids: UpdateAction[list[EntityId]],
    ) -> "ScheduleExport":
        """Update the schedule export."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            schedule_stream_ref_ids=schedule_stream_ref_ids.or_else(
                self.schedule_stream_ref_ids
            ),
        )
