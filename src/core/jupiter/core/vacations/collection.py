"""A vacation collection."""

from jupiter.core.vacations.root import Vacation
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


@entity("Workspace")
class VacationCollection(TrunkEntity):
    """A vacation collection."""

    workspace: ParentLink

    vacations = ContainsMany(Vacation, vacation_collection_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_vacation_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
    ) -> "VacationCollection":
        """Create a vacation collection."""
        return VacationCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
        )
