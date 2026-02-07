"""A milestone in a life plan."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.framework.base.adate import ADate
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
from jupiter.framework.update_action import UpdateAction


@entity
class Milestone(LeafEntity):
    """A milestone in a life plan."""

    life_plan: ParentLink
    name: MilestoneName
    project_ref_id: EntityId
    date: ADate

    note = OwnsAtMostOne(
        Note, domain=NoteDomain("milestone"), source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_milestone(
        ctx: MutationContext,
        life_plan_ref_id: EntityId,
        name: MilestoneName,
        project_ref_id: EntityId,
        date: ADate,
    ) -> "Milestone":
        """Create a milestone."""
        return Milestone._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=name,
            project_ref_id=project_ref_id,
            date=date,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[MilestoneName],
        date: UpdateAction[ADate],
        project_ref_id: UpdateAction[EntityId],
    ) -> "Milestone":
        """Update a milestone."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            project_ref_id=project_ref_id.or_else(self.project_ref_id),
            date=date.or_else(self.date),
        )
