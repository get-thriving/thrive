"""Command for updating the time configuration of a time_plan."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanChapterLink,
    TimePlanGoalLink,
)
from jupiter.core.time_plans.root import TimePlan
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanChangeTimeConfigArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    right_now: UpdateAction[ADate]
    period: UpdateAction[RecurringTaskPeriod]
    chapter_ref_ids: UpdateAction[list[EntityId]]
    aspect_ref_ids: UpdateAction[list[EntityId]]
    goal_ref_ids: UpdateAction[list[EntityId]]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanChangeTimeConfigUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanChangeTimeConfigArgs, None]
):
    """Command for updating the time configuration of a time_plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanChangeTimeConfigArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        time_plan = await uow.get_for(TimePlan).load_by_id(args.ref_id)
        # We allow updating life-plan links even for generated time plans.
        # But changing the time config (right_now/period) is only allowed when
        # the time plan source permits user changes.
        if args.right_now.should_change or args.period.should_change:
            time_plan = time_plan.change_time_config(
                context.domain_context, args.right_now, args.period
            )
            await uow.get_for(TimePlan).save(time_plan)
            await progress_reporter.mark_updated(time_plan)

        desired_chapter_ref_ids = set(args.chapter_ref_ids.or_else([]))
        desired_aspect_ref_ids = set(args.aspect_ref_ids.or_else([]))
        desired_goal_ref_ids = set(args.goal_ref_ids.or_else([]))

        if (
            desired_chapter_ref_ids or desired_aspect_ref_ids or desired_goal_ref_ids
        ) and not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            max_links = life_plan.time_plan_max_life_plan_links

            if len(desired_chapter_ref_ids) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} chapters."
                )
            if len(desired_aspect_ref_ids) > max_links:
                raise InputValidationError(
                    f"You can select at most {max_links} aspects."
                )
            if len(desired_goal_ref_ids) > max_links:
                raise InputValidationError(f"You can select at most {max_links} goals.")

            if desired_chapter_ref_ids:
                chapters = await uow.get_for(Chapter).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=list(desired_chapter_ref_ids),
                )
                if len(chapters) != len(desired_chapter_ref_ids):
                    raise Exception("Some chapters do not exist in this workspace")

            if desired_aspect_ref_ids:
                aspects = await uow.get_for(Aspect).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=list(desired_aspect_ref_ids),
                )
                if len(aspects) != len(desired_aspect_ref_ids):
                    raise Exception("Some aspects do not exist in this workspace")

            if desired_goal_ref_ids:
                goals = await uow.get_for(Goal).find_all(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=True,
                    filter_ref_ids=list(desired_goal_ref_ids),
                )
                if len(goals) != len(desired_goal_ref_ids):
                    raise Exception("Some goals do not exist in this workspace")

            existing_chapter_links = await uow.get_for_record(
                TimePlanChapterLink
            ).find_all(time_plan.ref_id)
            existing_aspect_links = await uow.get_for_record(
                TimePlanAspectLink
            ).find_all(time_plan.ref_id)
            existing_goal_links = await uow.get_for_record(TimePlanGoalLink).find_all(
                time_plan.ref_id
            )

            existing_chapter_ref_ids = {
                link.chapter_ref_id for link in existing_chapter_links
            }
            existing_aspect_ref_ids = {
                link.aspect_ref_id for link in existing_aspect_links
            }
            existing_goal_ref_ids = {link.goal_ref_id for link in existing_goal_links}

            for chapter_ref_id in existing_chapter_ref_ids - desired_chapter_ref_ids:
                await uow.get_for_record(TimePlanChapterLink).remove(
                    (time_plan.ref_id, chapter_ref_id)
                )
            for chapter_ref_id in desired_chapter_ref_ids - existing_chapter_ref_ids:
                time_plan_chapter_link = TimePlanChapterLink.new_link(
                    context.domain_context, time_plan.ref_id, chapter_ref_id
                )
                await uow.get_for_record(TimePlanChapterLink).create(
                    time_plan_chapter_link
                )

            for aspect_ref_id in existing_aspect_ref_ids - desired_aspect_ref_ids:
                await uow.get_for_record(TimePlanAspectLink).remove(
                    (time_plan.ref_id, aspect_ref_id)
                )
            for aspect_ref_id in desired_aspect_ref_ids - existing_aspect_ref_ids:
                time_plan_aspect_link = TimePlanAspectLink.new_link(
                    context.domain_context, time_plan.ref_id, aspect_ref_id
                )
                await uow.get_for_record(TimePlanAspectLink).create(
                    time_plan_aspect_link
                )

            for goal_ref_id in existing_goal_ref_ids - desired_goal_ref_ids:
                await uow.get_for_record(TimePlanGoalLink).remove(
                    (time_plan.ref_id, goal_ref_id)
                )
            for goal_ref_id in desired_goal_ref_ids - existing_goal_ref_ids:
                time_plan_goal_link = TimePlanGoalLink.new_link(
                    context.domain_context, time_plan.ref_id, goal_ref_id
                )
                await uow.get_for_record(TimePlanGoalLink).create(time_plan_goal_link)
