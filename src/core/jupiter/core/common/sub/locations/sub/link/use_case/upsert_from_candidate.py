"""Use case for creating a location from a candidate and linking it."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.link.root import (
    ALLOWED_LOCATION_LINK_OWNER_TYPES,
    OWNERS_ALLOWING_MULTIPLE_LOCATIONS,
    LocationLink,
    LocationLinkRepository,
)
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.locations.sub.location.service.create import (
    LocationCreateService,
)
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
    deduped: bool


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

        outcome = await LocationCreateService().do_it(
            ctx=context.domain_context,
            uow=uow,
            location_domain_ref_id=location_domain.ref_id,
            name=args.name,
            is_key=False,
            address_line=args.address_line,
            country=args.country,
            gps=args.gps,
        )

        existing_link = await uow.get(LocationLinkRepository).load_optional_for_owner(
            args.owner
        )
        if args.owner.the_type in OWNERS_ALLOWING_MULTIPLE_LOCATIONS:
            locations_ref_ids = (
                list(existing_link.locations_ref_ids)
                if existing_link is not None
                else []
            )
            if outcome.location.ref_id not in locations_ref_ids:
                locations_ref_ids.append(outcome.location.ref_id)
        else:
            locations_ref_ids = [outcome.location.ref_id]

        location_link = LocationLink.new_location_link(
            ctx=context.domain_context,
            location_domain_ref_id=location_domain.ref_id,
            owner=args.owner,
            locations_ref_ids=locations_ref_ids,
        )
        location_link = await uow.get(LocationLinkRepository).upsert(location_link)

        return LocationLinkUpsertFromCandidateResult(
            new_location=outcome.location,
            location_link=location_link,
            deduped=outcome.deduped,
        )
