"""The command for reporting on progress."""

from jupiter.core.config import JupiterLoggedInReadonlyUseCase
from jupiter.core.domain.application.report.report_breakdown import ReportBreakdown
from jupiter.core.domain.application.report.report_period_result import (
    ReportPeriodResult,
)
from jupiter.core.domain.application.report.service.report_service import ReportService
from jupiter.core.domain.concept.inbox_tasks.inbox_task_source import InboxTaskSource
from jupiter.core.domain.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInReadonlyUseCaseContext,
    readonly_use_case,
)
from jupiter.framework_new.base.adate import ADate
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ReportArgs(UseCaseArgsBase):
    """Report args."""

    today: ADate | None
    period: RecurringTaskPeriod
    sources: list[InboxTaskSource] | None
    breakdowns: list[ReportBreakdown] | None
    filter_project_ref_ids: list[EntityId] | None
    filter_big_plan_ref_ids: list[EntityId] | None
    filter_habit_ref_ids: list[EntityId] | None
    filter_chore_ref_ids: list[EntityId] | None
    filter_metric_ref_ids: list[EntityId] | None
    filter_person_ref_ids: list[EntityId] | None
    filter_slack_task_ref_ids: list[EntityId] | None
    filter_email_task_ref_ids: list[EntityId] | None
    breakdown_period: RecurringTaskPeriod | None


@use_case_result
class ReportResult(UseCaseResultBase):
    """Report results."""

    period_result: ReportPeriodResult


@readonly_use_case()
class ReportUseCase(JupiterLoggedInReadonlyUseCase[ReportArgs, ReportResult]):
    """The command for reporting on progress."""

    async def _execute(
        self,
        context: AppLoggedInReadonlyUseCaseContext,
        args: ReportArgs,
    ) -> ReportResult:
        """Execute the command."""
        user = context.user
        workspace = context.workspace

        report_service = ReportService(self._ports.domain_storage_engine)

        report_period_result = await report_service.do_it(
            user=user,
            workspace=workspace,
            today=args.today or self._time_provider.get_current_date(),
            period=args.period,
            sources=args.sources,
            breakdowns=args.breakdowns,
            filter_project_ref_ids=args.filter_project_ref_ids,
            filter_big_plan_ref_ids=args.filter_big_plan_ref_ids,
            filter_habit_ref_ids=args.filter_habit_ref_ids,
            filter_chore_ref_ids=args.filter_chore_ref_ids,
            filter_metric_ref_ids=args.filter_metric_ref_ids,
            filter_person_ref_ids=args.filter_person_ref_ids,
            filter_slack_task_ref_ids=args.filter_slack_task_ref_ids,
            filter_email_task_ref_ids=args.filter_email_task_ref_ids,
            breakdown_period=args.breakdown_period,
        )

        return ReportResult(period_result=report_period_result)
