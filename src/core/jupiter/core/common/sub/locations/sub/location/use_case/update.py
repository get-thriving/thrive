"""Use case for updating a location."""

from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.location.address_line import AddressLine
from jupiter.core.common.sub.locations.sub.location.country import CountryCode
from jupiter.core.common.sub.locations.sub.location.gps import GpsCoordinates
from jupiter.core.common.sub.locations.sub.location.name import LocationName
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpdateLeafSupportEntityArgs,
    JupiterUpdateLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class LocationUpdateArgs(JupiterUpdateLeafSupportEntityArgs):
    """LocationUpdate args."""

    ref_id: EntityId
    name: UpdateAction[LocationName | None]
    address_line: UpdateAction[AddressLine | None]
    country: UpdateAction[CountryCode | None]
    gps: UpdateAction[GpsCoordinates | None]


@mutation_use_case()
class LocationUpdateUseCase(
    JupiterUpdateLeafSupportEntityUseCase[LocationUpdateArgs, None]
):
    """Use case for updating a location."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LocationUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        _, location = await self.load_in_parent(
            uow,
            LocationDomain,
            Location,
            args.ref_id,
            context.workspace.ref_id,
        )
        location = location.update(
            ctx=context.domain_context,
            name=args.name,
            address_line=args.address_line,
            country=args.country,
            gps=args.gps,
        )
        await uow.get_for(Location).save(location)
