"""Retrieve details about a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import (
    TimePlan,
    TimePlanRepository,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_name import EntityName
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
class TimePlanLoadForDateAndPeriodArgs(UseCaseArgsBase):
    """Args."""

    right_now: ADate
    period: RecurringTaskPeriod
    allow_archived: bool | None


@use_case_result
class TimePlanLoadForDateAndPeriodResult(UseCaseResultBase):
    """Result."""

    time_plan: TimePlan | None
    sub_period_time_plans: list[TimePlan]


@readonly_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanLoadForTimeDateAndPeriodUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimePlanLoadForDateAndPeriodArgs, TimePlanLoadForDateAndPeriodResult
    ]
):
    """The command for loading details about a time plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanLoadForDateAndPeriodArgs,
    ) -> TimePlanLoadForDateAndPeriodResult:
        """Execute the command's actions."""
        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        schedule = schedules.get_schedule(
            period=args.period,
            name=EntityName("Test"),
            right_now=args.right_now.to_timestamp_at_end_of_day(),
        )

        all_time_plans = await uow.get(TimePlanRepository).find_all_in_range(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=False,
            filter_periods=[args.period, *args.period.all_smaller_periods],
            filter_start_date=schedule.first_day,
            filter_end_date=schedule.end_day,
        )

        return TimePlanLoadForDateAndPeriodResult(
            time_plan=next(
                (j for j in all_time_plans if j.period == args.period), None
            ),
            sub_period_time_plans=[
                tp for tp in all_time_plans if tp.period != args.period
            ],
        )
