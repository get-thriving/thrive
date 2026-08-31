"""Use case for archiving a schedule full day event."""

from jupiter.core.apps.schedule.sub.event_full_days.root import (
    ScheduleEventFullDays,
)
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.locations.sub.link.service.archive import (
    LocationLinkArchiveService,
)
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ScheduleEventFullDaysArchiveArgs(JupiterArchiveCrownEntityArgs):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleEventFullDaysArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[ScheduleEventFullDaysArchiveArgs, None]
):
    """Use case for archiving a schedule full day event."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleEventFullDaysArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_event_full_days = await self.load_entity(
            uow, context.user.ref_id, ScheduleEventFullDays, args.ref_id
        )
        if not schedule_event_full_days.can_be_modified_independently:
            raise InputValidationError("Cannot archive a non-user schedule event")

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days.ref_id,
            ),
            JupiterArchivalReason.USER,
        )
        await LocationLinkArchiveService().archive_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
                schedule_event_full_days.ref_id,
            ),
            JupiterArchivalReason.USER,
        )
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleEventFullDays,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
