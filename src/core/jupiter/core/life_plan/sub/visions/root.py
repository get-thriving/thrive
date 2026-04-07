"""A vision in a life plan."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.life_plan.sub.visions.status import VisionStatus
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)


@entity("LifePlan")
class Vision(LeafEntity):
    """A vision in a life plan."""

    life_plan: ParentLink
    status: VisionStatus

    note = OwnsOne(
        Note,
        namespace=NoteNamespace.VISION,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_draft_vision(
        ctx: DomainContext,
        life_plan_ref_id: EntityId,
    ) -> "Vision":
        """Create a vision."""
        return Vision._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=EntityName(
                f"Vision for {ctx.action_timestamp.as_date().format('YYYY-MM-DD')}`"
            ),
            status=VisionStatus.DRAFT,
        )

    @update_entity_action
    def mark_as_active(
        self,
        ctx: DomainContext,
    ) -> "Vision":
        """Mark the vision as active."""
        return self._new_version(
            ctx,
            status=VisionStatus.ACTIVE,
        )

    @update_entity_action
    def mark_as_old(
        self,
        ctx: DomainContext,
    ) -> "Vision":
        """Mark the vision as old."""
        return self._new_version(
            ctx,
            status=VisionStatus.OLD,
        )
