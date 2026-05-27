"""Use case for loading the eval settings for a life plan."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks import parent_link_namespace
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.eval_approach import LifePlanEvalApproach
from jupiter.core.life_plan.root import LifePlan
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


@use_case_args
class LifePlanLoadEvalSettingsArgs(UseCaseArgsBase):
    """LifePlanLoadEvalSettings args."""


@use_case_result
class LifePlanLoadEvalSettingsResult(UseCaseResultBase):
    """LifePlanLoadEvalSettings results."""

    eval_periods: list[RecurringTaskPeriod]
    eval_approach: LifePlanEvalApproach
    eval_task_gen_params: RecurringTaskGenParams | None
    eval_task_generation_in_advance_days: dict[RecurringTaskPeriod, int]
    eval_tasks: list[InboxTask]


@readonly_use_case(
    WorkspaceFeature.LIFE_PLAN, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class LifePlanLoadEvalSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        LifePlanLoadEvalSettingsArgs, LifePlanLoadEvalSettingsResult
    ],
):
    """The command for loading the eval settings for a life plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: LifePlanLoadEvalSettingsArgs,
    ) -> LifePlanLoadEvalSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        eval_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_parent_link_namespaces(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            parent_link_namespaces=[parent_link_namespace.LIFE_PLAN_EVAL],
        )

        return LifePlanLoadEvalSettingsResult(
            eval_periods=list(life_plan.eval_periods),
            eval_approach=life_plan.eval_approach,
            eval_task_gen_params=life_plan.eval_task_gen_params,
            eval_task_generation_in_advance_days=life_plan.eval_task_generation_in_advance_days,
            eval_tasks=eval_tasks,
        )
