"""A calendar export configuration."""

import abc
import uuid

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.schedule.sub.export.name import ScheduleExportName
from jupiter.framework.base.entity_id import EntityId
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
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class ScheduleExport(LeafEntity):
    """A calendar export configuration that bundles multiple schedule streams."""

    schedule_domain: ParentLink

    external_id: str
    name: ScheduleExportName
    schedule_stream_ref_ids: list[EntityId]
    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.SCHEDULE_EXPORT, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.SCHEDULE_EXPORT, source_entity_ref_id=IsRefId()
    )

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
            external_id=str(uuid.uuid4()),
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


class ScheduleExportRepository(LeafEntityRepository[ScheduleExport], abc.ABC):
    """A repository for schedule exports."""

    @abc.abstractmethod
    async def load_by_guid(
        self,
        external_id: str,
        allow_archived: bool = False,
    ) -> ScheduleExport:
        """Load a schedule export by its external GUID."""
