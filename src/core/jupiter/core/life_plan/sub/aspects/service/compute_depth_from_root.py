"""A service that computes the depth of a aspect from the root aspect."""

from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class AspectComputeDepthFromRootService:
    """A service that computes the depth of a aspect from the root aspect.

    Root aspect has depth 0, its children depth 1, etc.
    """

    async def do_it(self, uow: DomainUnitOfWork, aspect: Aspect) -> int:
        """Compute the depth of a aspect from the root aspect."""
        depth = 0
        current_ref_id: EntityId | None = aspect.parent_aspect_ref_id
        while current_ref_id is not None:
            depth += 1
            current_aspect = await uow.get_for(Aspect).load_by_id(current_ref_id)
            current_ref_id = current_aspect.parent_aspect_ref_id
        return depth
