"""A milestone in a life plan."""

from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("LifePlan")
class Milestone(LeafEntity):
    """A milestone in a life plan."""

    life_plan: ParentLink
    name: MilestoneName
    aspect_ref_id: EntityId
    date: ADate

    tag_link = OwnsAtMostOne(
        TagLink, owner=IsEntityLinkStd(NamedEntityTag.MILESTONE.value)
    )
    note = OwnsAtMostOne(Note, owner=IsEntityLinkStd(NamedEntityTag.MILESTONE.value))

    @staticmethod
    @create_entity_action
    def new_milestone(
        ctx: DomainContext,
        life_plan_ref_id: EntityId,
        name: MilestoneName,
        aspect_ref_id: EntityId,
        date: ADate,
    ) -> "Milestone":
        """Create a milestone."""
        return Milestone._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=name,
            aspect_ref_id=aspect_ref_id,
            date=date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[MilestoneName],
        date: UpdateAction[ADate],
        aspect_ref_id: UpdateAction[EntityId],
    ) -> "Milestone":
        """Update a milestone."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            aspect_ref_id=aspect_ref_id.or_else(self.aspect_ref_id),
            date=date.or_else(self.date),
        )
