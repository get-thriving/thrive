"""Use case for archiving a schedule stream."""

from jupiter.core.apps.schedule.sub.export.root import ScheduleExport
from jupiter.core.apps.schedule.sub.stream.root import (
    ScheduleStream,
    ScheduleStreamRepository,
)
from jupiter.core.apps.schedule.sub.stream.source import (
    ScheduleStreamSource,
)
from jupiter.core.archival_reason import JupiterArchivalReason
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
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class ScheduleStreamArchiveArgs(JupiterArchiveCrownEntityArgs):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleStreamArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[ScheduleStreamArchiveArgs, None]
):
    """Use case for archiving a schedule stream."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleStreamArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_stream = await self.load_entity(
            uow, context.user.ref_id, ScheduleStream, args.ref_id
        )
        if schedule_stream.source == ScheduleStreamSource.USER:
            user_stream_count = await uow.get(
                ScheduleStreamRepository
            ).count_all_streams_for_domain(
                schedule_stream.schedule_domain.ref_id,
                source=ScheduleStreamSource.USER,
                allow_archived=False,
            )
            if user_stream_count == 1:
                raise InputValidationError("You cannot archive the last user schedule")

        schedule_exports = await uow.get_for(ScheduleExport).find_all_generic(
            parent_ref_id=schedule_stream.schedule_domain.ref_id,
            allow_archived=True,
        )
        for schedule_export in schedule_exports:
            if schedule_stream.ref_id not in schedule_export.schedule_stream_ref_ids:
                continue

            updated_schedule_stream_ref_ids = [
                stream_ref_id
                for stream_ref_id in schedule_export.schedule_stream_ref_ids
                if stream_ref_id != schedule_stream.ref_id
            ]
            schedule_export = schedule_export.update(
                context.domain_context,
                name=UpdateAction.do_nothing(),
                schedule_stream_ref_ids=UpdateAction.change_to(
                    updated_schedule_stream_ref_ids
                ),
            )
            await uow.get_for(ScheduleExport).save(schedule_export)
            await progress_reporter.mark_updated(schedule_export)

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            context.domain_context,
            uow,
            EntityLink.std(
                NamedEntityTag.SCHEDULE_STREAM.value, schedule_stream.ref_id
            ),
            JupiterArchivalReason.USER,
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            ScheduleStream,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
