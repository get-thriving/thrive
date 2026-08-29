"""The command for creating a project."""

from jupiter.core.apps.life_plan.root import LifePlan
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.projects.collection import ProjectCollection
from jupiter.core.apps.projects.name import ProjectName
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.projects.stats import ProjectStats, ProjectStatsRepository
from jupiter.core.apps.projects.status import ProjectStatus
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectCreateArgs(JupiterCreateCrownEntityArgs):
    """Project create args."""

    name: ProjectName
    time_plan_ref_id: EntityId | None
    time_plan_activity_kind: TimePlanActivityKind | None
    time_plan_activity_feasability: TimePlanActivityFeasability | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    aspect_ref_id: EntityId | None
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    actionable_date: ADate | None
    due_date: ADate | None
    dependency_ref_ids: list[EntityId] | None = None


@use_case_result
class ProjectCreateResult(UseCaseResultBase):
    """Project create result."""

    new_project: Project
    new_time_plan_activity: TimePlanActivity | None


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectCreateUseCase(
    JupiterCreateCrownEntityUseCase[ProjectCreateArgs, ProjectCreateResult]
):
    """The command for creating a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectCreateArgs,
    ) -> ProjectCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if args.aspect_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.chapter_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.goal_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        time_plan: TimePlan | None = None
        if args.time_plan_ref_id:
            time_plan = await self.load_entity(
                uow, context.user.ref_id, TimePlan, args.time_plan_ref_id
            )

        if args.aspect_ref_id is None:
            life_plan = await uow.get_for(LifePlan).load_by_parent(
                workspace.ref_id,
            )
            the_aspect = await uow.get(AspectRepository).load_root_aspect(
                life_plan.ref_id
            )
        else:
            the_aspect = await self.load_entity(
                uow, context.user.ref_id, Aspect, args.aspect_ref_id
            )

        if args.chapter_ref_id is not None:
            chapter = await self.load_entity(
                uow, context.user.ref_id, Chapter, args.chapter_ref_id
            )
            if chapter.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Chapter does not belong to aspect '{the_aspect.name}'"
                )

        if args.goal_ref_id is not None:
            goal = await self.load_entity(
                uow, context.user.ref_id, Goal, args.goal_ref_id
            )
            if goal.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Goal does not belong to aspect '{the_aspect.name}'"
                )

        dependency_ref_ids = list(dict.fromkeys(args.dependency_ref_ids or []))
        if dependency_ref_ids:
            # Reader access is enough - a dependency points at another project,
            # it doesn't change it.
            await CheckForAclService().do_it_for_many(
                uow,
                Project,
                dependency_ref_ids,
                context.user.ref_id,
                AccessLevel.READER,
            )
            dependencies = await uow.get_for(Project).find_all_generic(
                allow_archived=False,
                ref_id=dependency_ref_ids,
            )
            if len(dependencies) != len(dependency_ref_ids):
                raise InputValidationError(
                    "Some of the projects to depend on could not be found"
                )
            # There is no cycle check here, unlike on update - nothing can point
            # at a project that is only now being created.

        project_collection = await uow.get_for(ProjectCollection).load_by_parent(
            workspace.ref_id,
        )

        new_project = Project.new_project(
            context.domain_context,
            project_collection_ref_id=project_collection.ref_id,
            aspect_ref_id=the_aspect.ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name,
            status=ProjectStatus.NOT_STARTED,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
            dependency_ref_ids=dependency_ref_ids,
        )
        new_project = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_project,
        )

        new_project_stats = ProjectStats.new_stats(
            context.domain_context,
            project_ref_id=new_project.ref_id,
        )
        new_project_stats = await uow.get(ProjectStatsRepository).create(
            new_project_stats
        )

        new_time_plan_activity = None
        if time_plan:
            time_plan_activity_kind = args.time_plan_activity_kind
            time_plan_activity_feasability = args.time_plan_activity_feasability
            if not time_plan_activity_kind:
                raise InputValidationError("An activity kind is required")
            if not time_plan_activity_feasability:
                raise InputValidationError("An activity feasability is required")

            new_time_plan_activity = TimePlanActivity.new_activity_for_project(
                context.domain_context,
                time_plan_ref_id=time_plan.ref_id,
                project_ref_id=new_project.ref_id,
                kind=time_plan_activity_kind,
                feasability=time_plan_activity_feasability,
            )
            new_time_plan_activity = await self.create_entity(
                context.domain_context,
                uow,
                progress_reporter,
                context.user.ref_id,
                new_time_plan_activity,
            )

        return ProjectCreateResult(
            new_project=new_project, new_time_plan_activity=new_time_plan_activity
        )
