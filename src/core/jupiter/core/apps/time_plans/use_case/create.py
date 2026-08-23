"""Use case for creating a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.apps.life_plan.root import LifePlan
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanChapterLink,
    TimePlanGoalLink,
)
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.question.service.build_note import (
    BuildNoteFromQuestionsService,
)
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
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
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class TimePlanCreateArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    right_now: ADate
    period: RecurringTaskPeriod
    question_ref_ids: list[EntityId] | None = None
    chapter_ref_ids: list[EntityId] | None = None
    aspect_ref_ids: list[EntityId] | None = None
    goal_ref_ids: list[EntityId] | None = None


@use_case_result
class TimePlanCreateResult(UseCaseResultBase):
    """Result."""

    new_time_plan: TimePlan
    new_note: Note


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanCreateUseCase(
    JupiterCreateCrownEntityUseCase[TimePlanCreateArgs, TimePlanCreateResult]
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
        new_time_plan = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_time_plan,
        )

        chapter_ref_ids = list(args.chapter_ref_ids or [])
        aspect_ref_ids = list(args.aspect_ref_ids or [])
        goal_ref_ids = list(args.goal_ref_ids or [])

        if (
            chapter_ref_ids or aspect_ref_ids or goal_ref_ids
        ) and not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            max_links = life_plan.time_plan_max_life_plan_links

            if len(set(chapter_ref_ids)) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} chapters."
                )
            if len(set(aspect_ref_ids)) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} aspects."
                )
            if len(set(goal_ref_ids)) > max_links:
                raise InputValidationError(f"You can select at most {max_links} goals.")

            if chapter_ref_ids:
                unique_chapter_ref_ids = list(set(chapter_ref_ids))
                chapters = await self.find_all_entities(
                    uow,
                    context.user.ref_id,
                    Chapter,
                    unique_chapter_ref_ids,
                    allow_archived=True,
                )
                if len(chapters) != len(unique_chapter_ref_ids):
                    raise InputValidationError(
                        "Some chapters do not exist in this workspace"
                    )
                for chapter in chapters:
                    time_plan_chapter_link = TimePlanChapterLink.new_link(
                        context.domain_context, new_time_plan.ref_id, chapter.ref_id
                    )
                    await uow.get_for_record(TimePlanChapterLink).create(
                        time_plan_chapter_link
                    )

            if aspect_ref_ids:
                unique_aspect_ref_ids = list(set(aspect_ref_ids))
                aspects = await self.find_all_entities(
                    uow,
                    context.user.ref_id,
                    Aspect,
                    unique_aspect_ref_ids,
                    allow_archived=True,
                )
                if len(aspects) != len(unique_aspect_ref_ids):
                    raise InputValidationError(
                        "Some aspects do not exist in this workspace"
                    )
                for aspect in aspects:
                    time_plan_aspect_link = TimePlanAspectLink.new_link(
                        context.domain_context, new_time_plan.ref_id, aspect.ref_id
                    )
                    await uow.get_for_record(TimePlanAspectLink).create(
                        time_plan_aspect_link
                    )

            if goal_ref_ids:
                unique_goal_ref_ids = list(set(goal_ref_ids))
                goals = await self.find_all_entities(
                    uow,
                    context.user.ref_id,
                    Goal,
                    unique_goal_ref_ids,
                    allow_archived=True,
                )
                if len(goals) != len(unique_goal_ref_ids):
                    raise InputValidationError(
                        "Some goals do not exist in this workspace"
                    )
                for goal in goals:
                    time_plan_goal_link = TimePlanGoalLink.new_link(
                        context.domain_context, new_time_plan.ref_id, goal.ref_id
                    )
                    await uow.get_for_record(TimePlanGoalLink).create(
                        time_plan_goal_link
                    )

        new_note = await BuildNoteFromQuestionsService().do_it(
            context.domain_context,
            uow,
            time_plan_domain=time_plan_domain,
            note_collection_ref_id=note_collection.ref_id,
            time_plan=new_time_plan,
            filter_question_ref_ids=args.question_ref_ids,
        )
        new_note = await generic_creator(uow, progress_reporter, new_note)

        return TimePlanCreateResult(new_time_plan=new_time_plan, new_note=new_note)
