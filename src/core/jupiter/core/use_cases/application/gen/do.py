"""The command for generating new tasks."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.domainx.application.gen.service.gen_service import GenService
from jupiter.core.domainx.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.core.sync_target import (
    SyncTarget,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class GenDoArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    gen_even_if_not_modified: bool
    today: ADate | None
    gen_targets: list[SyncTarget] | None
    period: list[RecurringTaskPeriod] | None
    filter_project_ref_ids: list[EntityId] | None
    filter_habit_ref_ids: list[EntityId] | None
    filter_chore_ref_ids: list[EntityId] | None
    filter_metric_ref_ids: list[EntityId] | None
    filter_person_ref_ids: list[EntityId] | None
    filter_slack_task_ref_ids: list[EntityId] | None
    filter_email_task_ref_ids: list[EntityId] | None


@mutation_use_case()
class GenDoUseCase(JupiterLoggedInMutationUseCase[GenDoArgs, None]):
    """The command for generating new tasks."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: GenDoArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace
        today = args.today or self._time_provider.get_current_date()

        gen_targets = (
            args.gen_targets
            if args.gen_targets is not None
            else infer_sync_targets_for_enabled_features(user, workspace, None)
        )

        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await gen_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=user,
            workspace=workspace,
            gen_even_if_not_modified=args.gen_even_if_not_modified,
            today=today,
            gen_targets=gen_targets,
            period=args.period,
            filter_project_ref_ids=args.filter_project_ref_ids,
            filter_habit_ref_ids=args.filter_habit_ref_ids,
            filter_chore_ref_ids=args.filter_chore_ref_ids,
            filter_metric_ref_ids=args.filter_metric_ref_ids,
            filter_person_ref_ids=args.filter_person_ref_ids,
            filter_slack_task_ref_ids=args.filter_slack_task_ref_ids,
            filter_email_task_ref_ids=args.filter_email_task_ref_ids,
        )
