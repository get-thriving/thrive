"""The person collection."""

from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.root import Person
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)

MAX_CIRCLES_PER_PERSON = 3


@entity
class PRM(TrunkEntity):
    """The personal relationship database."""

    workspace: ParentLink
    catch_up_aspect_ref_id: EntityId
    max_circles_per_person: int

    persons = ContainsMany(Person, prm_ref_id=IsRefId())
    circles = ContainsMany(Circle, prm_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_prm(
        ctx: MutationContext,
        workspace_ref_id: EntityId,
        catch_up_aspect_ref_id: EntityId,
    ) -> "PRM":
        """Create a new personal database."""
        return PRM._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            catch_up_aspect_ref_id=catch_up_aspect_ref_id,
            max_circles_per_person=MAX_CIRCLES_PER_PERSON,
        )

    @update_entity_action
    def change_catch_up_aspect(
        self,
        ctx: MutationContext,
        catch_up_aspect_ref_id: EntityId,
    ) -> "PRM":
        """Change the catch up aspect."""
        return self._new_version(
            ctx,
            catch_up_aspect_ref_id=catch_up_aspect_ref_id,
        )
