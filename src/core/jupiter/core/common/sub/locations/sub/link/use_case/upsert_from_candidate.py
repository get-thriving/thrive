"""Use case for creating a location from a candidate and linking it."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.link.root import (
    ALLOWED_LOCATION_LINK_OWNER_TYPES,
    LocationLink,
    LocationLinkRepository,
)
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpsertLeafSupportEntityArgs,
    JupiterUpsertLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LocationLinkUpsertFromCandidateArgs(JupiterUpsertLeafSupportEntityArgs):
    """LocationLinkUpsertFromCandidate args."""

    owner: EntityLink
    name: LocationName | None
    address_line: AddressLine | None
    country: CountryCode | None
    gps: GpsCoordinates | None


@use_case_result
class LocationLinkUpsertFromCandidateResult(UseCaseResultBase):
    """LocationLinkUpsertFromCandidate result."""

    new_location: Location
    location_link: LocationLink


@mutation_use_case()
class LocationLinkUpsertFromCandidateUseCase(
    JupiterUpsertLeafSupportEntityUseCase[
        LocationLinkUpsertFromCandidateArgs, LocationLinkUpsertFromCandidateResult
    ]
):
    """Create a location from resolver candidate fields and link it to an owner."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LocationLinkUpsertFromCandidateArgs,
    ) -> LocationLinkUpsertFromCandidateResult:
        """Execute the command's action."""
        # Locations are a per-workspace namespace: only the entity owner may
        # assign them, and only to entities in this workspace.
        await self.check_owner_and_find_workspace(
            uow,
            context.user.ref_id,
            context.workspace.ref_id,
            args.owner,
            ALLOWED_LOCATION_LINK_OWNER_TYPES,
            AccessLevel.OWNER,
            require_in_caller_workspace=True,
        )
        location_domain = await self.load_parent(
            uow, LocationDomain, context.workspace.ref_id
        )

        new_location = Location.new_location(
            ctx=context.domain_context,
            location_domain_ref_id=location_domain.ref_id,
            name=args.name,
            address_line=args.address_line,
            country=args.country,
            gps=args.gps,
        )
        new_location = await uow.get_for(Location).create(new_location)

        location_link = LocationLink.new_location_link(
            ctx=context.domain_context,
            location_domain_ref_id=location_domain.ref_id,
            owner=args.owner,
            location_ref_id=new_location.ref_id,
        )
        location_link = await uow.get(LocationLinkRepository).upsert(location_link)

        return LocationLinkUpsertFromCandidateResult(
            new_location=new_location,
            location_link=location_link,
        )
