"""Use case for finding locations."""

from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LocationFindArgs(UseCaseArgsBase):
    """LocationFind args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class LocationFindResult(UseCaseResultBase):
    """LocationFind result."""

    locations: list[Location]


@readonly_use_case()
class LocationFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[LocationFindArgs, LocationFindResult]
):
    """Use case for finding locations."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: LocationFindArgs,
    ) -> LocationFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        location_domain = await uow.get_for(LocationDomain).load_by_parent(
            workspace.ref_id
        )

        locations = await uow.get_for(Location).find_all_generic(
            parent_ref_id=location_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        return LocationFindResult(locations=locations)
