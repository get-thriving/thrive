"""Command for updating the time configuration of a time_plan."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domainx.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.features import WorkspaceFeature
from jupiter.core.time_plans.root import TimePlan
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanChangeTimeConfigArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    right_now: UpdateAction[ADate]
    period: UpdateAction[RecurringTaskPeriod]


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanChangeTimeConfigUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanChangeTimeConfigArgs, None]
):
    """Command for updating the time configuration of a time_plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanChangeTimeConfigArgs,
    ) -> None:
        """Execute the command's action."""
        time_plan = await uow.get_for(TimePlan).load_by_id(args.ref_id)
        time_plan = time_plan.change_time_config(
            context.domain_context, args.right_now, args.period
        )
        await uow.get_for(TimePlan).save(time_plan)
        await progress_reporter.mark_updated(time_plan)
