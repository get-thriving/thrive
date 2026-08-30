"""Use case for searching stored locations and resolver candidates."""

from jupiter.core.common.search.limit import SearchLimit
from jupiter.core.common.search.query import SearchQuery
from jupiter.core.common.sub.locations.resolver.resolver import (
    LocationResolverCandidate,
    location_matches_query,
)
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)

_DEFAULT_SEARCH_LIMIT = 10


@use_case_args
class LocationSearchArgs(UseCaseArgsBase):
    """LocationSearch args."""

    query: SearchQuery
    limit: SearchLimit | None
    include_archived: bool | None


@use_case_result
class LocationSearchResult(UseCaseResultBase):
    """LocationSearch result."""

    locations: list[Location]
    candidates: list[LocationResolverCandidate]


@readonly_use_case()
class LocationSearchUseCase(
    JupiterLoggedInReadonlyUseCase[LocationSearchArgs, LocationSearchResult]
):
    """Search existing workspace locations and resolver candidates."""

    async def _execute(
        self,
        context: JupiterLoggedInReadonlyContext,
        args: LocationSearchArgs,
    ) -> LocationSearchResult:
        """Execute the command's action."""
        allow_archived = args.include_archived or False
        limit = (
            args.limit if args.limit is not None else SearchLimit(_DEFAULT_SEARCH_LIMIT)
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            location_domain = await uow.get_for(LocationDomain).load_by_parent(
                context.workspace.ref_id
            )
            all_locations = await uow.get_for(Location).find_all_generic(
                parent_ref_id=location_domain.ref_id,
                allow_archived=allow_archived,
            )

        locations = [
            location
            for location in all_locations
            if location_matches_query(location, args.query)
        ][: limit.the_limit]

        resolver_page = await self._ports.location_resolver.resolve(
            args.query,
            limit,
        )

        return LocationSearchResult(
            locations=locations,
            candidates=resolver_page.candidates,
        )
