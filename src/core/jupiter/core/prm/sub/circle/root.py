"""A circle of people."""

from jupiter.core.prm.sub.circle.name import CircleName
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
class Circle(LeafEntity):
    """A circle of people, user-defined."""

    prm: ParentLink
    name: CircleName

    @staticmethod
    @create_entity_action
    def new_circle(
        ctx: MutationContext,
        prm_ref_id: EntityId,
        name: CircleName,
    ) -> "Circle":
        """Create a circle."""
        return Circle._create(
            ctx,
            prm=ParentLink(prm_ref_id),
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[CircleName],
    ) -> "Circle":
        """Update the circle."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )
