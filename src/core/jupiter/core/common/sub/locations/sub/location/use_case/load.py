"""Use case for loading a location."""

from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LocationLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """LocationLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class LocationLoadResult(UseCaseResultBase):
    """LocationLoad result."""

    location: Location


@readonly_use_case()
class LocationLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[LocationLoadArgs, LocationLoadResult]
):
    """Use case for loading a location."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: LocationLoadArgs,
    ) -> LocationLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        _, location = await self.load_in_parent(
            uow,
            LocationDomain,
            Location,
            args.ref_id,
            context.workspace.ref_id,
            allow_archived=allow_archived,
        )
        return LocationLoadResult(location=location)
