"""Use case for creating a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.life_plan_links import (
    TimePlanChapterLink,
    TimePlanGoalLink,
    TimePlanProjectLink,
)
from jupiter.core.time_plans.root import TimePlan
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
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class TimePlanCreateArgs(UseCaseArgsBase):
    """Args."""

    right_now: ADate
    period: RecurringTaskPeriod
    chapter_ref_ids: list[EntityId] | None = None
    project_ref_ids: list[EntityId] | None = None
    goal_ref_ids: list[EntityId] | None = None


@use_case_result
class TimePlanCreateResult(UseCaseResultBase):
    """Result."""

    new_time_plan: TimePlan
    new_note: Note


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API])
class TimePlanCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanCreateArgs, TimePlanCreateResult
    ]
):
    """Use case for creating a time plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanCreateArgs,
    ) -> TimePlanCreateResult:
        """Execute the command's actions."""
        workspace = context.workspace

        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id,
        )
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id
        )

        new_time_plan = TimePlan.new_time_plan_for_user(
            context.domain_context,
            time_plan_domain_ref_id=time_plan_domain.ref_id,
            right_now=args.right_now,
            period=args.period,
        )
        new_time_plan = await generic_creator(uow, progress_reporter, new_time_plan)

        chapter_ref_ids = list(args.chapter_ref_ids or [])
        project_ref_ids = list(args.project_ref_ids or [])
        goal_ref_ids = list(args.goal_ref_ids or [])

        if (
            chapter_ref_ids or project_ref_ids or goal_ref_ids
        ) and not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            max_links = life_plan.time_plan_max_life_plan_links

            if len(set(chapter_ref_ids)) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} chapters."
                )
            if len(set(project_ref_ids)) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} projects."
                )
            if len(set(goal_ref_ids)) > max_links:
                raise InputValidationError(f"You can select at most {max_links} goals.")

            if chapter_ref_ids:
                chapters = await uow.get_for(Chapter).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=chapter_ref_ids,
                )
                if len(chapters) != len(set(chapter_ref_ids)):
                    raise InputValidationError(
                        "Some chapters do not exist in this workspace"
                    )
                for chapter_ref_id in set(chapter_ref_ids):
                    time_plan_chapter_link = TimePlanChapterLink.new_link(
                        context.domain_context, new_time_plan.ref_id, chapter_ref_id
                    )
                    await uow.get_for_record(TimePlanChapterLink).create(
                        time_plan_chapter_link
                    )

            if project_ref_ids:
                projects = await uow.get_for(Project).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=project_ref_ids,
                )
                if len(projects) != len(set(project_ref_ids)):
                    raise InputValidationError(
                        "Some projects do not exist in this workspace"
                    )
                for project_ref_id in set(project_ref_ids):
                    time_plan_project_link = TimePlanProjectLink.new_link(
                        context.domain_context, new_time_plan.ref_id, project_ref_id
                    )
                    await uow.get_for_record(TimePlanProjectLink).create(
                        time_plan_project_link
                    )

            if goal_ref_ids:
                goals = await uow.get_for(Goal).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=goal_ref_ids,
                )
                if len(goals) != len(set(goal_ref_ids)):
                    raise InputValidationError(
                        "Some goals do not exist in this workspace"
                    )
                for goal_ref_id in set(goal_ref_ids):
                    time_plan_goal_link = TimePlanGoalLink.new_link(
                        context.domain_context, new_time_plan.ref_id, goal_ref_id
                    )
                    await uow.get_for_record(TimePlanGoalLink).create(
                        time_plan_goal_link
                    )

        new_note = Note.new_note(
            context.domain_context,
            note_collection_ref_id=note_collection.ref_id,
            namespace=NoteNamespace.TIME_PLAN,
            source_entity_ref_id=new_time_plan.ref_id,
            content=[],
        )
        new_note = await generic_creator(uow, progress_reporter, new_note)

        return TimePlanCreateResult(new_time_plan=new_time_plan, new_note=new_note)
