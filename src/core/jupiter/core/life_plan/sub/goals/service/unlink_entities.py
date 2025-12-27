"""A service for unlinking a goal from associated entities."""

from typing import cast

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.habits.root import Habit
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.adate import ADate
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class GoalUnlinkEntitiesService:
    """A service for unlinking a goal from associated entities."""

    async def unlink_entities(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        life_plan: LifePlan,
        goal: Goal,
    ) -> None:
        """Unlink the goal from associated inbox tasks, big plans, chores, and habits."""
        # Unlink from BigPlans
        big_plans = await uow.get_for(BigPlan).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            goal_ref_id=goal.ref_id,
        )
        big_plans_by_ref_id = {big_plan.ref_id: big_plan for big_plan in big_plans}
        for big_plan in big_plans:
            updated_big_plan = big_plan.update(
                ctx,
                name=UpdateAction.do_nothing(),
                status=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.do_nothing(),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.change_to(None),
                is_key=UpdateAction.do_nothing(),
                eisen=UpdateAction.do_nothing(),
                difficulty=UpdateAction.do_nothing(),
                actionable_date=UpdateAction.do_nothing(),
                due_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(BigPlan).save(updated_big_plan)
            await progress_reporter.mark_updated(updated_big_plan)

        # Unlink from Chores
        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            goal_ref_id=goal.ref_id,
        )
        chores_by_ref_id = {chore.ref_id: chore for chore in chores}
        for chore in chores:
            updated_chore = chore.update(
                ctx,
                name=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.do_nothing(),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.change_to(None),
                is_key=UpdateAction.do_nothing(),
                gen_params=UpdateAction.do_nothing(),
                start_at_date=UpdateAction.do_nothing(),
                end_at_date=UpdateAction.do_nothing(),
                must_do=UpdateAction.do_nothing(),
            )
            await uow.get_for(Chore).save(updated_chore)
            await progress_reporter.mark_updated(updated_chore)

        # Unlink from Habits
        habits = await uow.get_for(Habit).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            goal_ref_id=goal.ref_id,
        )
        habits_by_ref_id = {habit.ref_id: habit for habit in habits}
        for habit in habits:
            updated_habit = habit.update(
                ctx,
                name=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.do_nothing(),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.change_to(None),
                is_key=UpdateAction.do_nothing(),
                gen_params=UpdateAction.do_nothing(),
                repeats_in_period_count=UpdateAction.do_nothing(),
                repeats_strategy=UpdateAction.do_nothing(),
            )
            await uow.get_for(Habit).save(updated_habit)
            await progress_reporter.mark_updated(updated_habit)

        # Unlink from InboxTasks
        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=False,
            goal_ref_id=goal.ref_id,
        )
        for inbox_task in inbox_tasks:
            match inbox_task.source:
                case InboxTaskSource.USER:
                    updated_inbox_task = inbox_task.update(
                        ctx,
                        name=UpdateAction.do_nothing(),
                        status=UpdateAction.do_nothing(),
                        big_plan_ref_id=UpdateAction.do_nothing(),
                        is_key=UpdateAction.do_nothing(),
                        project_ref_id=UpdateAction.do_nothing(),
                        chapter_ref_id=UpdateAction.do_nothing(),
                        goal_ref_id=UpdateAction.change_to(None),
                        eisen=UpdateAction.do_nothing(),
                        difficulty=UpdateAction.do_nothing(),
                        actionable_date=UpdateAction.do_nothing(),
                        due_date=UpdateAction.do_nothing(),
                    )
                case InboxTaskSource.BIG_PLAN:
                    big_plan = big_plans_by_ref_id[
                        inbox_task.source_entity_ref_id_for_sure
                    ]
                    updated_inbox_task = inbox_task.update_link_to_big_plan(
                        ctx,
                        project_ref_id=big_plan.project_ref_id,
                        chapter_ref_id=big_plan.chapter_ref_id,
                        goal_ref_id=None,
                        big_plan_ref_id=big_plan.ref_id,
                    )
                case InboxTaskSource.CHORE:
                    chore = chores_by_ref_id[inbox_task.source_entity_ref_id_for_sure]
                    updated_inbox_task = inbox_task.update_link_to_chore(
                        ctx,
                        project_ref_id=chore.project_ref_id,
                        chapter_ref_id=chore.chapter_ref_id,
                        goal_ref_id=None,
                        name=inbox_task.name,
                        timeline=cast(str, inbox_task.recurring_timeline),
                        is_key=inbox_task.is_key,
                        actionable_date=inbox_task.actionable_date,
                        due_date=cast(ADate, inbox_task.due_date),
                        eisen=inbox_task.eisen,
                        difficulty=inbox_task.difficulty,
                    )
                case InboxTaskSource.HABIT:
                    habit = habits_by_ref_id[inbox_task.source_entity_ref_id_for_sure]
                    updated_inbox_task = inbox_task.update_link_to_habit(
                        ctx,
                        project_ref_id=habit.project_ref_id,
                        chapter_ref_id=habit.chapter_ref_id,
                        goal_ref_id=None,
                        name=inbox_task.name,
                        timeline=cast(str, inbox_task.recurring_timeline),
                        repeat_index=cast(int, inbox_task.recurring_repeat_index),
                        repeats_in_period_count=habit.repeats_in_period_count,
                        is_key=inbox_task.is_key,
                        actionable_date=inbox_task.actionable_date,
                        due_date=cast(ADate, inbox_task.due_date),
                        eisen=inbox_task.eisen,
                        difficulty=inbox_task.difficulty,
                    )
                case _:
                    raise Exception(f"Unknown inbox task source: {inbox_task.source}")
            await uow.get_for(InboxTask).save(updated_inbox_task)
            await progress_reporter.mark_updated(updated_inbox_task)
