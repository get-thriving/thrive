"""Use case for creating time plan activities for projects."""

from jupiter.core.app import AppCore
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.load_for_acl import (
    LoadForAclService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
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
class TimePlanAssociateProjectWithPlanArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    project_ref_id: EntityId
    time_plan_ref_ids: list[EntityId]
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateProjectWithPlanResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateProjectWithPlanUseCase(
    JupiterCreateCrownEntityUseCase[
        TimePlanAssociateProjectWithPlanArgs, TimePlanAssociateProjectWithPlanResult
    ]
):
    """Use case for creating activities starting from a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateProjectWithPlanArgs,
    ) -> TimePlanAssociateProjectWithPlanResult:
        """Execute the command's actions."""
        if len(args.time_plan_ref_ids) == 0:
            raise InputValidationError("You must specify some time plans")

        project = await LoadForAclService().do_it(
            uow,
            Project,
            args.project_ref_id,
            context.user.ref_id,
            AccessLevel.READER,
        )

        time_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            TimePlan,
            args.time_plan_ref_ids,
            allow_archived=False,
        )

        latest_time_plan = max(time_plans, key=lambda x: x.end_date)

        new_time_plan_activities = []

        for time_plan in time_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_project(
                    context.domain_context,
                    time_plan_ref_id=time_plan.ref_id,
                    project_ref_id=project.ref_id,
                    kind=args.kind,
                    feasability=args.feasability,
                )
                new_time_plan_activity = await self.create_entity(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    context.user.ref_id,
                    new_time_plan_activity,
                )
                new_time_plan_activities.append(new_time_plan_activity)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this plan, no need to panic
                pass

        if project.actionable_date is None or project.due_date is None:
            try:
                await CheckForAclService().do_it(
                    uow,
                    Project,
                    project.ref_id,
                    context.user.ref_id,
                    AccessLevel.WRITER,
                )
            except UserNotAllowedAccessToEntityError:
                pass
            else:
                project = project.change_dates_via_time_plan(
                    context.domain_context,
                    actionable_date=latest_time_plan.start_date,
                    due_date=latest_time_plan.end_date,
                )
                await uow.get_for(Project).save(project)
                await progress_reporter.mark_updated(project)

        return TimePlanAssociateProjectWithPlanResult(
            new_time_plan_activities=new_time_plan_activities
        )
