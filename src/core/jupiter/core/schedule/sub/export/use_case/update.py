"""Use case for updating a schedule export."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.sub.export.name import ScheduleExportName
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ScheduleExportUpdateArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    name: UpdateAction[ScheduleExportName]
    schedule_stream_ref_ids: UpdateAction[list[EntityId]]


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ScheduleExportUpdateArgs, None]
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
        schedule_export = await uow.get_for(ScheduleExport).load_by_id(args.ref_id)

        schedule_export = schedule_export.update(
            context.domain_context,
            name=args.name,
            schedule_stream_ref_ids=args.schedule_stream_ref_ids,
        )

        await uow.get_for(ScheduleExport).save(schedule_export)
        await progress_reporter.mark_updated(schedule_export)
