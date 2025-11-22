"""Use case for loading a time plan activity activity."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_loader import generic_loader


@use_case_args
class TimePlanActivityLoadArgs(UseCaseArgsBase):
    """TimePlanActivityLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class TimePlanActivityLoadResult(UseCaseResultBase):
    """TimePlanActivityLoadResult."""

    time_plan_activity: TimePlanActivity
    target_inbox_task: InboxTask | None
    target_big_plan: BigPlan | None


@readonly_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanActivityLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimePlanActivityLoadArgs, TimePlanActivityLoadResult
    ]
):
    """Use case for loading a time plan activity activity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanActivityLoadArgs,
    ) -> TimePlanActivityLoadResult:
        """Execute the command's action."""
        workspace = context.workspace

        time_plan_activity, target_inbox_task, target_big_plan = await generic_loader(
            uow,
            TimePlanActivity,
            args.ref_id,
            TimePlanActivity.target_inbox_task,
            TimePlanActivity.target_big_plan,
            allow_archived=args.allow_archived,
            allow_subentity_archived=args.allow_archived,
        )

        if not workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
            target_big_plan = None

        return TimePlanActivityLoadResult(
            time_plan_activity=time_plan_activity,
            target_inbox_task=target_inbox_task,
            target_big_plan=target_big_plan,
        )
