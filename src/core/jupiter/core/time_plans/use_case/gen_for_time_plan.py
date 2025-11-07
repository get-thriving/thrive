"""The command for generating new tasks in the context of a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanGenForTimePlanArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    today: ADate
    period: list[RecurringTaskPeriod] | None


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanGenForTimePlanUseCase(
    JupiterLoggedInMutationUseCase[TimePlanGenForTimePlanArgs, None]
):
    """The command for generating new tasks for a time plan."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanGenForTimePlanArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace
        today = args.today

        gen_targets = infer_sync_targets_for_enabled_features(user, workspace, None)

        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await gen_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=user,
            workspace=workspace,
            gen_even_if_not_modified=False,
            today=today,
            gen_targets=gen_targets,
            period=args.period,
            filter_project_ref_ids=None,
            filter_habit_ref_ids=None,
            filter_chore_ref_ids=None,
            filter_metric_ref_ids=None,
            filter_person_ref_ids=None,
            filter_slack_task_ref_ids=None,
            filter_email_task_ref_ids=None,
        )
