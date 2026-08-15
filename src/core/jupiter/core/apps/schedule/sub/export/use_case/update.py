"""Use case for updating a schedule export."""

from jupiter.core.apps.schedule.sub.export.name import ScheduleExportName
from jupiter.core.apps.schedule.sub.export.root import ScheduleExport
from jupiter.core.apps.schedule.sub.stream.root import ScheduleStream
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ScheduleExportUpdateArgs(JupiterUpdateCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    name: UpdateAction[ScheduleExportName]
    schedule_stream_ref_ids: UpdateAction[list[EntityId]]


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[ScheduleExportUpdateArgs, None]
):
    """Use case for updating a schedule export."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleExportUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        schedule_export = await self.load_entity(
            uow, context.user.ref_id, ScheduleExport, args.ref_id
        )

        if args.schedule_stream_ref_ids.should_change:
            updated_schedule_stream_ref_ids = (
                args.schedule_stream_ref_ids.just_the_value
            )
            if not updated_schedule_stream_ref_ids:
                raise InputValidationError(
                    "At least one schedule stream must be provided to update a schedule export."
                )
            schedule_streams = await self.find_all_entities(
                uow,
                context.user.ref_id,
                ScheduleStream,
                ref_ids=updated_schedule_stream_ref_ids,
                allow_archived=False,
            )
            found_stream_ref_ids = {stream.ref_id for stream in schedule_streams}
            missing_stream_ref_ids = (
                set(updated_schedule_stream_ref_ids) - found_stream_ref_ids
            )
            if missing_stream_ref_ids:
                raise InputValidationError(
                    "The following schedule streams are not found or are archived: "
                    f"{missing_stream_ref_ids}"
                )

        schedule_export = schedule_export.update(
            context.domain_context,
            name=args.name,
            schedule_stream_ref_ids=args.schedule_stream_ref_ids,
        )

        await uow.get_for(ScheduleExport).save(schedule_export)
        await progress_reporter.mark_updated(schedule_export)
