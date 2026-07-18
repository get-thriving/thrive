"""Use case for creating a schedule export."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.export.name import ScheduleExportName
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ScheduleExportCreateArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    name: ScheduleExportName
    schedule_stream_ref_ids: list[EntityId]


@use_case_result
class ScheduleExportCreateResult(UseCaseResultBase):
    """Result."""

    new_schedule_export: ScheduleExport


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportCreateUseCase(
    JupiterCreateCrownEntityUseCase[
        ScheduleExportCreateArgs, ScheduleExportCreateResult
    ]
):
    """Use case for creating a schedule export."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ScheduleExportCreateArgs,
    ) -> ScheduleExportCreateResult:
        """Perform the transactional mutation."""
        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        if not args.schedule_stream_ref_ids:
            raise InputValidationError(
                "At least one schedule stream must be provided to create a schedule export."
            )
        schedule_streams = await self.find_all_entities(
            uow,
            context.user.ref_id,
            ScheduleStream,
            ref_ids=args.schedule_stream_ref_ids,
            allow_archived=False,
        )
        found_stream_ref_ids = {stream.ref_id for stream in schedule_streams}
        missing_stream_ref_ids = (
            set(args.schedule_stream_ref_ids) - found_stream_ref_ids
        )
        if missing_stream_ref_ids:
            raise InputValidationError(
                f"The following schedule streams are not found or are archived: {missing_stream_ref_ids}"
            )
        schedule_export = ScheduleExport.new_schedule_export(
            context.domain_context,
            schedule_domain_ref_id=schedule_domain.ref_id,
            name=args.name,
            schedule_stream_ref_ids=args.schedule_stream_ref_ids,
        )
        schedule_export = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            schedule_export,
        )
        return ScheduleExportCreateResult(new_schedule_export=schedule_export)
