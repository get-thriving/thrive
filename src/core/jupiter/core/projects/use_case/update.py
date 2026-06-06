"""The command for updating a project."""

from jupiter.core.projects.name import ProjectName
from jupiter.core.projects.root import Project
from jupiter.core.projects.status import ProjectStatus
from jupiter.core.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import UserFeature, WorkspaceFeature
from jupiter.core.gamification.service.record_score import (
    RecordScoreResult,
    RecordScoreService,
)
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[ProjectName]
    status: UpdateAction[ProjectStatus]
    aspect_ref_id: UpdateAction[EntityId]
    chapter_ref_id: UpdateAction[EntityId | None]
    goal_ref_id: UpdateAction[EntityId | None]
    is_key: UpdateAction[bool]
    eisen: UpdateAction[Eisen]
    difficulty: UpdateAction[Difficulty]
    actionable_date: UpdateAction[ADate | None]
    due_date: UpdateAction[ADate | None]


@use_case_result
class ProjectUpdateResult(UseCaseResultBase):
    """InboxTaskUpdate result."""

    record_score_result: RecordScoreResult | None


@mutation_use_case(WorkspaceFeature.PROJECTS)
class ProjectUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ProjectUpdateArgs, ProjectUpdateResult]
):
    """The command for updating a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectUpdateArgs,
    ) -> ProjectUpdateResult:
        """Execute the command's action."""
        workspace = context.workspace
        project = await uow.get_for(Project).load_by_id(args.ref_id)

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if (
                args.aspect_ref_id.should_change
                and args.aspect_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.chapter_ref_id.should_change
                and args.chapter_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.goal_ref_id.should_change
                and args.goal_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        # Check each milestone is within the new date bounds
        if args.actionable_date.should_change or args.due_date.should_change:
            # Get the new dates, falling back to existing ones if not changing
            new_actionable = args.actionable_date.or_else(project.actionable_date)
            new_due = args.due_date.or_else(project.due_date)

            milestones = await uow.get_for(ProjectMilestone).find_all_generic(
                project_ref_id=project.ref_id,
                allow_archived=False,
            )

            for m in milestones:
                if new_actionable and m.date < new_actionable:
                    raise InputValidationError(
                        f"Milestone {m.name} date {m.date} is before new actionable date {new_actionable}"
                    )
                if new_due and m.date > new_due:
                    raise InputValidationError(
                        f"Milestone {m.name} date {m.date} is after new due date {new_due}"
                    )

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN) and (
            args.aspect_ref_id.should_change
            or args.chapter_ref_id.should_change
            or args.goal_ref_id.should_change
        ):
            aspect = await uow.get_for(Aspect).load_by_id(
                args.aspect_ref_id.or_else(project.aspect_ref_id)
            )
            chapter_ref_id = args.chapter_ref_id.or_else(project.chapter_ref_id)
            goal_ref_id = args.goal_ref_id.or_else(project.goal_ref_id)
            if chapter_ref_id and chapter_ref_id != project.chapter_ref_id:
                chapter = await uow.get_for(Chapter).load_by_id(chapter_ref_id)
                if chapter.aspect_ref_id != aspect.ref_id:
                    raise InputValidationError(
                        f"Chapter does not belong to aspect '{aspect.name}'"
                    )
            if goal_ref_id and goal_ref_id != project.goal_ref_id:
                goal = await uow.get_for(Goal).load_by_id(goal_ref_id)
                if goal.aspect_ref_id != aspect.ref_id:
                    raise InputValidationError(
                        f"Goal does not belong to aspect '{aspect.name}'"
                    )

        project = project.update(
            context.domain_context,
            name=args.name,
            status=args.status,
            aspect_ref_id=args.aspect_ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
        )

        await uow.get_for(Project).save(project)
        await progress_reporter.mark_updated(project)

        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.aspect_ref_id.should_change
        ):
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            all_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            )

            for inbox_task in all_inbox_tasks:
                inbox_task = inbox_task.update_link_to_project(
                    context.domain_context,
                    project_ref_id=project.ref_id,
                    name=UpdateAction.do_nothing(),
                    status=UpdateAction.do_nothing(),
                    is_key=UpdateAction.do_nothing(),
                    actionable_date=UpdateAction.do_nothing(),
                    due_date=UpdateAction.do_nothing(),
                    eisen=UpdateAction.do_nothing(),
                    difficulty=UpdateAction.do_nothing(),
                )
                await uow.get_for(InboxTask).save(inbox_task)

        record_score_result = None
        if context.user.is_feature_available(UserFeature.GAMIFICATION):
            record_score_result = await RecordScoreService().record_task(
                context.domain_context, uow, context.user, project
            )

        return ProjectUpdateResult(record_score_result=record_score_result)
