"""Use case for creating a location."""

from jupiter.core.common.sub.locations.root import LocationDomain
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
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LocationCreateArgs(UseCaseArgsBase):
    """LocationCreate args."""

    name: LocationName | None
    address_line: AddressLine | None
    country: CountryCode | None
    gps: GpsCoordinates | None
    is_key: bool = False


@use_case_result
class LocationCreateResult(UseCaseResultBase):
    """LocationCreate result."""

    new_location: Location
    deduped: bool


@mutation_use_case()
class LocationCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        LocationCreateArgs, LocationCreateResult
    ]
):
    """Use case for creating a location."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LocationCreateArgs,
    ) -> LocationCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        location_domain = await uow.get_for(LocationDomain).load_by_parent(
            workspace.ref_id
        )

        outcome = await LocationCreateService().do_it(
            ctx=context.domain_context,
            uow=uow,
            location_domain_ref_id=location_domain.ref_id,
            name=args.name,
            is_key=args.is_key,
            address_line=args.address_line,
            country=args.country,
            gps=args.gps,
        )
        return LocationCreateResult(
            new_location=outcome.location,
            deduped=outcome.deduped,
        )
