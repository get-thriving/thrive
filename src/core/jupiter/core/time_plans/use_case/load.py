"""Retrieve details about a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.service.load import TimePlanLoadResult, TimePlanLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

__all__ = ["TimePlanLoadArgs", "TimePlanLoadResult", "TimePlanLoadUseCase"]


@use_case_args
class TimePlanLoadArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    allow_archived: bool | None
    include_targets: bool | None
    include_completed_nontarget: bool | None
    include_other_time_plans: bool | None


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TimePlanLoadArgs, TimePlanLoadResult]
):
    """The command for loading details about a time plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanLoadArgs,
    ) -> TimePlanLoadResult:
        """Execute the command's actions."""
        allow_archived = args.allow_archived or False
        include_targets = args.include_targets or False
        include_completed_nontarget = args.include_completed_nontarget or False
        include_other_time_plans = args.include_other_time_plans or False

        time_plan = await uow.get_for(TimePlan).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await TimePlanLoadService().do_it(
            uow,
            context.workspace,
            time_plan,
            allow_archived=allow_archived,
            include_targets=include_targets,
            include_completed_nontarget=include_completed_nontarget,
            include_other_time_plans=include_other_time_plans,
        )
