"""The person collection."""

from typing import TYPE_CHECKING

from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.root import Person
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
)

MAX_CIRCLES_PER_PERSON = 3

if TYPE_CHECKING:
    from jupiter.core.workspaces.root import Workspace


@entity
class PRM(TrunkEntity):
    """The personal relationship database."""

    workspace: ParentLink["Workspace"]
    max_circles_per_person: int

    persons = ContainsMany(Person, prm_ref_id=IsRefId())
    circles = ContainsMany(Circle, prm_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_prm(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "PRM":
        """Create a new personal database."""
        return PRM._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            max_circles_per_person=MAX_CIRCLES_PER_PERSON,
        )
