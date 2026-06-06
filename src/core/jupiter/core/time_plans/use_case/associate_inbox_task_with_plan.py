"""Use case for creating time plan activities for inbox tasks."""

from jupiter.core.app import AppCore
from jupiter.core.projects.root import Project
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.domain import TimePlanDomain
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
class TimePlanAssociateInboxTaskWithPlanArgs(UseCaseArgsBase):
    """Args."""

    inbox_task_ref_id: EntityId
    time_plan_ref_ids: list[EntityId]
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateInboxTaskWithPlanResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateInboxTaskWithPlanUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanAssociateInboxTaskWithPlanArgs, TimePlanAssociateInboxTaskWithPlanResult
    ]
):
    """Use case for creating activities starting from an inbox task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateInboxTaskWithPlanArgs,
    ) -> TimePlanAssociateInboxTaskWithPlanResult:
        """Execute the command's actions."""
        if len(args.time_plan_ref_ids) == 0:
            raise InputValidationError("You must specify some time plans")

        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        inbox_task = await uow.get_for(InboxTask).load_by_id(args.inbox_task_ref_id)
        project = None
        if inbox_task.owner.the_type == NamedEntityTag.PROJECT.value:
            project = await uow.get_for(Project).load_by_id(inbox_task.owner.ref_id)

        time_plans = await uow.get_for(TimePlan).find_all(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=False,
            filter_ref_ids=args.time_plan_ref_ids,
        )

        for time_plan in time_plans:
            if not time_plan.allows_inbox_tasks:
                raise InputValidationError(
                    f"Time plan {time_plan.name} does not allow inbox task activities"
                )

        latest_time_plan = max(time_plans, key=lambda x: x.end_date)

        new_time_plan_activities = []

        for time_plan in time_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_inbox_task(
                    context.domain_context,
                    time_plan_ref_id=time_plan.ref_id,
                    inbox_task_ref_id=inbox_task.ref_id,
                    kind=args.kind,
                    feasability=args.feasability,
                )
                new_time_plan_activity = await generic_creator(
                    uow, progress_reporter, new_time_plan_activity
                )
                new_time_plan_activities.append(new_time_plan_activity)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this plan, no need to panic
                pass

            if inbox_task.allow_user_changes and inbox_task.due_date is None:
                inbox_task = inbox_task.change_due_date_via_time_plan(
                    context.domain_context, due_date=latest_time_plan.end_date
                )
                await uow.get_for(InboxTask).save(inbox_task)

            if project is not None:
                try:
                    new_time_plan_activity = TimePlanActivity.new_activity_for_project(
                        context.domain_context,
                        time_plan_ref_id=time_plan.ref_id,
                        project_ref_id=project.ref_id,
                        kind=TimePlanActivityKind.MAKE_PROGRESS,
                        feasability=TimePlanActivityFeasability.NICE_TO_HAVE,
                    )
                    new_time_plan_activity = await generic_creator(
                        uow, progress_reporter, new_time_plan_activity
                    )
                    new_time_plan_activities.append(new_time_plan_activity)
                except TimePlanAlreadyAssociatedWithTargetError:
                    # We were already working on this plan, no need to panic
                    pass

                if project.actionable_date is None or project.due_date is None:
                    project = project.change_dates_via_time_plan(
                        context.domain_context,
                        actionable_date=latest_time_plan.start_date,
                        due_date=latest_time_plan.end_date,
                    )
                    await uow.get_for(Project).save(project)
                    await progress_reporter.mark_updated(project)

        return TimePlanAssociateInboxTaskWithPlanResult(
            new_time_plan_activities=new_time_plan_activities
        )
