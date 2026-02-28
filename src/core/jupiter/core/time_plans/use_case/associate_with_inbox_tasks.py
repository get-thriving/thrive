"""Use case for creating time plan actitivities for inbox tasks."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class TimePlanAssociateWithInboxTasksArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    inbox_task_ref_ids: list[EntityId]
    override_existing_dates: bool
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateWithInboxTasksResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API])
class TimePlanAssociateWithInboxTasksUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanAssociateWithInboxTasksArgs, TimePlanAssociateWithInboxTasksResult
    ]
):
    """Use case for creating activities starting from inbox tasks."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithInboxTasksArgs,
    ) -> TimePlanAssociateWithInboxTasksResult:
        """Execute the command's actions."""
        if len(args.inbox_task_ref_ids) == 0:
            raise InputValidationError("You must specifiy some inbox tasks")

        workspace = context.workspace

        time_plan = await uow.get_for(TimePlan).load_by_id(args.ref_id)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id
        )
        inbox_tasks = await uow.get_for(InboxTask).find_all(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=False,
            filter_ref_ids=args.inbox_task_ref_ids,
        )

        big_plan_ref_ids = [
            it.source_entity_ref_id_for_sure
            for it in inbox_tasks
            if it.source == InboxTaskSource.BIG_PLAN
        ]
        big_plans = []
        if len(big_plan_ref_ids) > 0:
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id
            )
            big_plans = await uow.get_for(BigPlan).find_all(
                parent_ref_id=big_plan_collection.ref_id,
                allow_archived=False,
                filter_ref_ids=big_plan_ref_ids,
            )

        new_time_plan_actitivies = []

        for inbox_task in inbox_tasks:
            new_time_plan_activity = TimePlanActivity.new_activity_for_inbox_task(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
                inbox_task_ref_id=inbox_task.ref_id,
                kind=args.kind,
                feasability=args.feasability,
            )
            new_time_plan_activity = await generic_creator(
                uow, progress_reporter, new_time_plan_activity
            )
            new_time_plan_actitivies.append(new_time_plan_activity)

            if inbox_task.allow_user_changes and (
                inbox_task.due_date is None or args.override_existing_dates
            ):
                inbox_task = inbox_task.change_due_date_via_time_plan(
                    context.domain_context, due_date=time_plan.end_date
                )
                await uow.get_for(InboxTask).save(inbox_task)
                await progress_reporter.mark_updated(inbox_task)

        for big_plan in big_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_big_plan(
                    context.domain_context,
                    time_plan_ref_id=args.ref_id,
                    big_plan_ref_id=big_plan.ref_id,
                    kind=TimePlanActivityKind.MAKE_PROGRESS,
                    feasability=TimePlanActivityFeasability.NICE_TO_HAVE,
                )
                new_time_plan_activity = await generic_creator(
                    uow, progress_reporter, new_time_plan_activity
                )
                new_time_plan_actitivies.append(new_time_plan_activity)

                if big_plan.actionable_date is None or big_plan.due_date is None:
                    big_plan = big_plan.change_dates_via_time_plan(
                        context.domain_context,
                        actionable_date=time_plan.start_date,
                        due_date=time_plan.end_date,
                    )
                    await uow.get_for(BigPlan).save(big_plan)
                    await progress_reporter.mark_updated(big_plan)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this plan, no need to panic
                pass

        return TimePlanAssociateWithInboxTasksResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
