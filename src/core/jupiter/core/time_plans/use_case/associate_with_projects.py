"""Use case for creating time plan actitivities for projects."""

from jupiter.core.app import AppCore
from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
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
class TimePlanAssociateWithProjectsArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    project_ref_ids: list[EntityId]
    override_existing_dates: bool
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateWithProjectsResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateWithProjectsUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanAssociateWithProjectsArgs, TimePlanAssociateWithProjectsResult
    ]
):
    """Use case for creating activities starting from projects."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithProjectsArgs,
    ) -> TimePlanAssociateWithProjectsResult:
        """Execute the command's actions."""
        if len(args.project_ref_ids) == 0:
            raise InputValidationError("You must specifiy some projects")

        workspace = context.workspace

        time_plan = await uow.get_for(TimePlan).load_by_id(args.ref_id)

        project_collection = await uow.get_for(ProjectCollection).load_by_parent(
            workspace.ref_id
        )
        projects = await uow.get_for(Project).find_all(
            parent_ref_id=project_collection.ref_id,
            allow_archived=False,
            filter_ref_ids=args.project_ref_ids,
        )

        new_time_plan_actitivies = []

        for project in projects:
            new_time_plan_activity = TimePlanActivity.new_activity_for_project(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
                project_ref_id=project.ref_id,
                kind=args.kind,
                feasability=args.feasability,
            )
            new_time_plan_activity = await generic_creator(
                uow, progress_reporter, new_time_plan_activity
            )
            new_time_plan_actitivies.append(new_time_plan_activity)

            if (
                project.actionable_date is None or project.due_date is None
            ) or args.override_existing_dates:
                project = project.change_dates_via_time_plan(
                    context.domain_context,
                    actionable_date=time_plan.start_date,
                    due_date=time_plan.end_date,
                )
                await uow.get_for(Project).save(project)
                await progress_reporter.mark_updated(project)

        return TimePlanAssociateWithProjectsResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
