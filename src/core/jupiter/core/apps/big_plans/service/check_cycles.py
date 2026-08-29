"""A service that checks for cycles in the big plan dependency graph."""

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class BigPlanDependenciesHaveCyclesError(Exception):
    """Exception raised when the big plan dependency graph has cycles."""


class BigPlanCheckCyclesService:
    """A service that checks for cycles in the big plan dependency graph."""

    async def check_for_cycles(self, uow: DomainUnitOfWork, big_plan: BigPlan) -> None:
        """Check for cycles in the big plan dependency graph."""
        # Dependencies form a graph and not a tree, so this walks it one level
        # at a time, out from the big plan, until it either comes back to the
        # big plan or runs out of new ones to look at.
        seen: set[EntityId] = {big_plan.ref_id}
        to_visit = list(big_plan.dependency_ref_ids)

        while to_visit:
            if big_plan.ref_id in to_visit:
                raise BigPlanDependenciesHaveCyclesError

            next_ref_ids = [ref_id for ref_id in to_visit if ref_id not in seen]
            if not next_ref_ids:
                return
            seen.update(next_ref_ids)

            # A dependency that no longer exists just drops out here.
            dependencies = await uow.get_for(BigPlan).find_all_generic(
                allow_archived=True,
                ref_id=next_ref_ids,
            )
            to_visit = [
                dependency_ref_id
                for dependency in dependencies
                for dependency_ref_id in dependency.dependency_ref_ids
            ]
