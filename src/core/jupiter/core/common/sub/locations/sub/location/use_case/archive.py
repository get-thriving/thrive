"""Use case for archiving a location."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.locations.root import LocationDomain
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterArchiveLeafSupportEntityArgs,
    JupiterArchiveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class LocationArchiveArgs(JupiterArchiveLeafSupportEntityArgs):
    """LocationArchive args."""

    ref_id: EntityId


@mutation_use_case()
class LocationArchiveUseCase(
    JupiterArchiveLeafSupportEntityUseCase[LocationArchiveArgs, None]
):
    """Use case for archiving a location."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LocationArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        location_domain, location = await self.load_in_parent(
            uow,
            LocationDomain,
            Location,
            args.ref_id,
            context.workspace.ref_id,
        )
        location = location.mark_archived(
            context.domain_context, JupiterArchivalReason.USER
        )
        await uow.get_for(Location).save(location)

        # Location links for this domain already sit in the caller's workspace
        # namespace; only the entity owner can assign locations there, so walking
        # those links needs no further per-owner ACL check.
        all_location_links = await uow.get_for(LocationLink).find_all_generic(
            parent_ref_id=location_domain.ref_id,
            allow_archived=True,
        )

        for location_link in all_location_links:
            if location.ref_id not in location_link.locations_ref_ids:
                continue
            new_locations_ref_ids = [
                ref_id
                for ref_id in location_link.locations_ref_ids
                if ref_id != location.ref_id
            ]
            location_link = location_link.update(
                context.domain_context,
                locations_ref_ids=UpdateAction.change_to(new_locations_ref_ids),
            )
            await uow.get_for(LocationLink).save(location_link)
