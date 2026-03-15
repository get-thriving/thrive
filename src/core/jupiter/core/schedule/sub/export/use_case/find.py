"""Usecase for finding schedule exports."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.export.root import ScheduleExport
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class ScheduleExportFindArgs(UseCaseArgsBase):
    """Args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class ScheduleExportFindResultEntry(UseCaseResultBase):
    """A single entry in the find schedule exports response."""

    schedule_export: ScheduleExport


@use_case_result
class ScheduleExportFindResult(UseCaseResultBase):
    """The result."""

    entries: list[ScheduleExportFindResultEntry]


@readonly_use_case(WorkspaceFeature.SCHEDULE)
class ScheduleExportFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        ScheduleExportFindArgs, ScheduleExportFindResult
    ]
):
    """Usecase for finding schedule exports."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ScheduleExportFindArgs,
    ) -> ScheduleExportFindResult:
        """Perform the transactional read."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        schedule_domain = await uow.get_for(ScheduleDomain).load_by_parent(
            workspace.ref_id
        )
        schedule_exports = await uow.get_for(ScheduleExport).find_all_generic(
            parent_ref_id=schedule_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        return ScheduleExportFindResult(
            entries=[
                ScheduleExportFindResultEntry(schedule_export=se)
                for se in schedule_exports
            ]
        )
