"""The command for creating a metric."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.entity_icon import EntityIcon
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.direction import MetricDirection
from jupiter.core.metrics.name import MetricName
from jupiter.core.metrics.root import Metric
from jupiter.core.metrics.unit import MetricUnit
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class MetricCreateArgs(JupiterCreateCrownEntityArgs):
    """MetricCreate args."""

    name: MetricName
    is_key: bool
    icon: EntityIcon | None
    collection_period: RecurringTaskPeriod | None
    collection_eisen: Eisen | None
    collection_difficulty: Difficulty | None
    collection_actionable_from_day: RecurringTaskDueAtDay | None
    collection_actionable_from_month: RecurringTaskDueAtMonth | None
    collection_due_at_day: RecurringTaskDueAtDay | None
    collection_due_at_month: RecurringTaskDueAtMonth | None
    metric_unit: MetricUnit | None
    metric_direction: MetricDirection


@use_case_result
class MetricCreateResult(UseCaseResultBase):
    """MetricCreate result."""

    new_metric: Metric


@mutation_use_case(WorkspaceFeature.METRICS)
class MetricCreateUseCase(
    JupiterCreateCrownEntityUseCase[MetricCreateArgs, MetricCreateResult]
):
    """The command for creating a metric."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricCreateArgs,
    ) -> MetricCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        collection_params = None
        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id,
        )

        if args.collection_period is not None:
            collection_eisen = args.collection_eisen or Eisen.REGULAR
            collection_difficulty = args.collection_difficulty or Difficulty.EASY
            collection_params = RecurringTaskGenParams(
                period=args.collection_period,
                eisen=collection_eisen,
                difficulty=collection_difficulty,
                actionable_from_day=args.collection_actionable_from_day,
                actionable_from_month=args.collection_actionable_from_month,
                due_at_day=args.collection_due_at_day,
                due_at_month=args.collection_due_at_month,
                skip_rule=None,
            )

        new_metric = Metric.new_metric(
            context.domain_context,
            metric_collection_ref_id=metric_collection.ref_id,
            name=args.name,
            is_key=args.is_key,
            icon=args.icon,
            collection_params=collection_params,
            metric_unit=args.metric_unit,
            metric_direction=args.metric_direction,
        )
        new_metric = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_metric,
        )

        return MetricCreateResult(new_metric=new_metric)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MetricCreateArgs,
        result: MetricCreateResult,
    ) -> None:
        """Execute the command's post-mutation work."""
        if args.collection_period is None:
            return
        await GenService(self._ports.domain_storage_engine).do_it(
            context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=False,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.METRICS],
            period=[args.collection_period],
            filter_metric_ref_ids=[result.new_metric.ref_id],
        )
