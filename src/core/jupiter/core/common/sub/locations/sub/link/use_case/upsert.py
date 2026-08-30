"""Use case for upserting a location link."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.link.root import (
    ALLOWED_LOCATION_LINK_OWNER_TYPES,
    LocationLink,
    LocationLinkRepository,
)
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpsertLeafSupportEntityArgs,
    JupiterUpsertLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class LocationLinkUpsertArgs(JupiterUpsertLeafSupportEntityArgs):
    """LocationLinkUpsert args."""

    owner: EntityLink
    location_ref_ids: list[EntityId]


@use_case_result
class LocationLinkUpsertResult(UseCaseResultBase):
    """LocationLinkUpsert result."""

    location_link: LocationLink


@mutation_use_case()
class LocationLinkUpsertUseCase(
    JupiterUpsertLeafSupportEntityUseCase[
        LocationLinkUpsertArgs, LocationLinkUpsertResult
    ]
):
    """Use case for upserting a location link."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LocationLinkUpsertArgs,
    ) -> LocationLinkUpsertResult:
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

        unique_location_ref_ids = list(dict.fromkeys(args.location_ref_ids))
        if len(unique_location_ref_ids) > 0:
            locations = await uow.get_for(Location).find_all_generic(
                parent_ref_id=location_domain.ref_id,
                allow_archived=False,
                ref_id=unique_location_ref_ids,
            )
            found_ref_ids = {location.ref_id for location in locations}
            missing_ref_ids = [
                ref_id
                for ref_id in unique_location_ref_ids
                if ref_id not in found_ref_ids
            ]
            if len(missing_ref_ids) > 0:
                raise EntityNotFoundError(
                    f"Could not find locations {missing_ref_ids} in this workspace"
                )

        location_link = LocationLink.new_location_link(
            ctx=context.domain_context,
            location_domain_ref_id=location_domain.ref_id,
            owner=args.owner,
            locations_ref_ids=unique_location_ref_ids,
        )
        location_link = await uow.get(LocationLinkRepository).upsert(location_link)

        return LocationLinkUpsertResult(location_link=location_link)
