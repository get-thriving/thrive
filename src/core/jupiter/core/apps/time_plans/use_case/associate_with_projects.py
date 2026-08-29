"""Use case for creating time plan actitivities for projects."""

from jupiter.core.app import AppCore
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
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
class TimePlanAssociateWithProjectsArgs(JupiterUpdateCrownEntityArgs):
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
    JupiterUpdateCrownEntityUseCase[
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

        time_plan = await self.load_entity(
            uow, context.user.ref_id, TimePlan, args.ref_id
        )

        projects = await self.find_all_generic(
            uow,
            context.user.ref_id,
            Project,
            allow_archived=False,
            ref_id=args.project_ref_ids,
            minimum_access_level=AccessLevel.READER,
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
            new_time_plan_activity = await self.create_entity(
                context.domain_context,
                uow,
                progress_reporter,
                context.user.ref_id,
                new_time_plan_activity,
            )
            new_time_plan_actitivies.append(new_time_plan_activity)

            if (
                project.actionable_date is None or project.due_date is None
            ) or args.override_existing_dates:
                try:
                    await CheckForAclService().do_it(
                        uow,
                        Project,
                        project.ref_id,
                        context.user.ref_id,
                        AccessLevel.WRITER,
                        allow_archived=False,
                    )
                except UserNotAllowedAccessToEntityError:
                    pass
                else:
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
