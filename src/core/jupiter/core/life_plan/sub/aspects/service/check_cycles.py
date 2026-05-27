"""A service that checks for cycles in the aspect graph."""

from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class AspectTreeHasCyclesError(Exception):
    """Exception raised when the aspect tree has cycles."""


class AspectCheckCyclesService:
    """A service that checks for cycles in the aspect graph."""

    async def check_for_cycles(self, uow: DomainUnitOfWork, aspect: Aspect) -> None:
        """Check for cycles in the aspect graph."""
        if aspect.parent_aspect_ref_id is None:
            return

        current_ref_id: EntityId | None = aspect.parent_aspect_ref_id

        while current_ref_id is not None:
            if current_ref_id == aspect.ref_id:
                raise AspectTreeHasCyclesError
            current_aspect = await uow.get_for(Aspect).load_by_id(current_ref_id)
            current_ref_id = current_aspect.parent_aspect_ref_id
