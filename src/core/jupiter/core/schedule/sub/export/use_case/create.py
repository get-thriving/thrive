"""Use case for creating a schedule export."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.export.name import ScheduleExportName
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class ScheduleExportCreateArgs(UseCaseArgsBase):
    """Args."""

    name: ScheduleExportName
    schedule_stream_ref_ids: list[EntityId]


@use_case_result
class ScheduleExportCreateResult(UseCaseResultBase):
    """Result."""

    new_schedule_export: ScheduleExport


@mutation_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
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
        schedule_export = ScheduleExport.new_schedule_export(
            context.domain_context,
            schedule_domain_ref_id=schedule_domain.ref_id,
            name=args.name,
            schedule_stream_ref_ids=args.schedule_stream_ref_ids,
        )
        schedule_export = await generic_creator(uow, progress_reporter, schedule_export)
        return ScheduleExportCreateResult(new_schedule_export=schedule_export)
