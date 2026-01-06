"""Service for reassigning linked entities."""

from typing import cast

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common import schedules
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.prm.root import PRM
from jupiter.core.push_integrations.group import PushIntegrationGroup
from jupiter.core.push_integrations.sub.email.task_collection import EmailTaskCollection
from jupiter.core.push_integrations.sub.slack.task_collection import SlackTaskCollection
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.life_plan_links import (
    TimePlanProjectLinkRepository,
)
from jupiter.core.working_mem.collection import WorkingMemCollection
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class ProjectReassignLinkedEntitiesService:
    """Service for reassigning linked entities."""

    async def reassign_linked_entities(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        workspace: Workspace,
        old_project: Project,
        new_project: Project,
    ) -> None:
        """Reassign linked entities."""
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )
        if time_plan_domain.planning_task_project_ref_id == old_project.ref_id:
            time_plan_domain = (
                time_plan_domain.change_planning_task_project_if_required(
                    ctx,
                    new_project.ref_id,
                )
            )
            await uow.get_for(TimePlanDomain).save(time_plan_domain)

        await uow.get(TimePlanProjectLinkRepository).remove_all_for_project(
            old_project.ref_id
        )

        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id
        )
        if journal_collection.writing_task_project_ref_id == old_project.ref_id:
            journal_collection = (
                journal_collection.change_writing_task_project_if_required(
                    ctx,
                    new_project.ref_id,
                )
            )
            await uow.get_for(JournalCollection).save(journal_collection)

        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id
        )
        if metric_collection.collection_project_ref_id == old_project.ref_id:
            metric_collection = metric_collection.change_collection_project(
                ctx,
                new_project.ref_id,
            )
            await uow.get_for(MetricCollection).save(metric_collection)

        prm = await uow.get_for(PRM).load_by_parent(workspace.ref_id)
        if prm.catch_up_project_ref_id == old_project.ref_id:
            prm = prm.change_catch_up_project(
                ctx,
                new_project.ref_id,
            )
            await uow.get_for(PRM).save(prm)

        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )
        if slack_task_collection.generation_project_ref_id == old_project.ref_id:
            slack_task_collection = slack_task_collection.change_generation_project(
                ctx,
                new_project.ref_id,
            )
            await uow.get_for(SlackTaskCollection).save(slack_task_collection)

        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        email_task_collection = await uow.get_for(EmailTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )
        if email_task_collection.generation_project_ref_id == old_project.ref_id:
            email_task_collection = email_task_collection.change_generation_project(
                ctx,
                new_project.ref_id,
            )
            await uow.get_for(EmailTaskCollection).save(email_task_collection)

        working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_parent(
            workspace.ref_id
        )
        if working_mem_collection.cleanup_project_ref_id == old_project.ref_id:
            working_mem_collection = working_mem_collection.update(
                ctx,
                generation_period=UpdateAction.do_nothing(),
                cleanup_project_ref_id=UpdateAction.change_to(new_project.ref_id),
            )
            await uow.get_for(WorkingMemCollection).save(working_mem_collection)

        # Unlink from BigPlans
        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
            workspace.ref_id
        )
        big_plans = await uow.get_for(BigPlan).find_all_generic(
            parent_ref_id=big_plan_collection.ref_id,
            allow_archived=True,
            project_ref_id=old_project.ref_id,
        )

        big_plans_by_ref_id = {big_plan.ref_id: big_plan for big_plan in big_plans}
        for big_plan in big_plans:
            updated_big_plan = big_plan.update(
                ctx,
                name=UpdateAction.do_nothing(),
                status=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                eisen=UpdateAction.do_nothing(),
                difficulty=UpdateAction.do_nothing(),
                actionable_date=UpdateAction.do_nothing(),
                due_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(BigPlan).save(updated_big_plan)
            await progress_reporter.mark_updated(updated_big_plan)
            big_plans_by_ref_id[big_plan.ref_id] = updated_big_plan

        # Unlink from Chores
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id
        )
        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=True,
            project_ref_id=old_project.ref_id,
        )
        chores_by_ref_id = {chore.ref_id: chore for chore in chores}
        for chore in chores:
            updated_chore = chore.update(
                ctx,
                name=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                gen_params=UpdateAction.do_nothing(),
                start_at_date=UpdateAction.do_nothing(),
                end_at_date=UpdateAction.do_nothing(),
                must_do=UpdateAction.do_nothing(),
            )
            await uow.get_for(Chore).save(updated_chore)
            await progress_reporter.mark_updated(updated_chore)
            chores_by_ref_id[chore.ref_id] = updated_chore

        # Unlink from Habits
        habit_collection = await uow.get_for(HabitCollection).load_by_parent(
            workspace.ref_id
        )
        habits = await uow.get_for(Habit).find_all_generic(
            parent_ref_id=habit_collection.ref_id,
            allow_archived=True,
            project_ref_id=old_project.ref_id,
        )
        habits_by_ref_id = {habit.ref_id: habit for habit in habits}
        for habit in habits:
            updated_habit = habit.update(
                ctx,
                name=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                gen_params=UpdateAction.do_nothing(),
                repeats_in_period_count=UpdateAction.do_nothing(),
                repeats_strategy=UpdateAction.do_nothing(),
            )
            await uow.get_for(Habit).save(updated_habit)
            await progress_reporter.mark_updated(updated_habit)
            habits_by_ref_id[habit.ref_id] = updated_habit

        # Unlink from InboxTasks
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id
        )
        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            project_ref_id=old_project.ref_id,
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
                        project_ref_id=UpdateAction.change_to(new_project.ref_id),
                        chapter_ref_id=UpdateAction.do_nothing(),
                        goal_ref_id=UpdateAction.do_nothing(),
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
                        project_ref_id=new_project.ref_id,
                        chapter_ref_id=big_plan.chapter_ref_id,
                        goal_ref_id=big_plan.goal_ref_id,
                        big_plan_ref_id=big_plan.ref_id,
                    )
                case InboxTaskSource.CHORE:
                    chore = chores_by_ref_id[inbox_task.source_entity_ref_id_for_sure]
                    schedule = schedules.get_schedule(
                        chore.gen_params.period,
                        chore.name,
                        cast(Timestamp, inbox_task.recurring_gen_right_now),
                        chore.gen_params.skip_rule,
                        chore.gen_params.actionable_from_day,
                        chore.gen_params.actionable_from_month,
                        chore.gen_params.due_at_day,
                        chore.gen_params.due_at_month,
                    )
                    updated_inbox_task = inbox_task.update_link_to_chore(
                        ctx,
                        project_ref_id=new_project.ref_id,
                        chapter_ref_id=chore.chapter_ref_id,
                        goal_ref_id=chore.goal_ref_id,
                        name=schedule.full_name,
                        timeline=schedule.timeline,
                        is_key=chore.is_key,
                        actionable_date=schedule.actionable_date,
                        due_date=schedule.due_date,
                        eisen=chore.gen_params.eisen,
                        difficulty=chore.gen_params.difficulty,
                    )
                case InboxTaskSource.HABIT:
                    habit = habits_by_ref_id[inbox_task.source_entity_ref_id_for_sure]
                    schedule = schedules.get_schedule(
                        chore.gen_params.period,
                        chore.name,
                        cast(Timestamp, inbox_task.recurring_gen_right_now),
                        chore.gen_params.skip_rule,
                        chore.gen_params.actionable_from_day,
                        chore.gen_params.actionable_from_month,
                        chore.gen_params.due_at_day,
                        chore.gen_params.due_at_month,
                    )
                    updated_inbox_task = inbox_task.update_link_to_habit(
                        ctx,
                        project_ref_id=new_project.ref_id,
                        chapter_ref_id=habit.chapter_ref_id,
                        goal_ref_id=habit.goal_ref_id,
                        name=schedule.full_name,
                        timeline=schedule.timeline,
                        repeat_index=cast(int, inbox_task.recurring_repeat_index),
                        repeats_in_period_count=habit.repeats_in_period_count,
                        is_key=habit.is_key,
                        actionable_date=schedule.actionable_date,
                        due_date=schedule.due_date,
                        eisen=habit.gen_params.eisen,
                        difficulty=habit.gen_params.difficulty,
                    )
                case InboxTaskSource.EMAIL_TASK | InboxTaskSource.SLACK_TASK:
                    updated_inbox_task = inbox_task.just_update_project(
                        ctx,
                        project_ref_id=new_project.ref_id,
                    )
                case _:
                    raise Exception(f"Unknown inbox task source: {inbox_task.source}")
            await uow.get_for(InboxTask).save(updated_inbox_task)
            await progress_reporter.mark_updated(updated_inbox_task)

        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        milestones = await uow.get_for(
            Milestone
        ).find_all_generic(  # pyright: ignore[reportUndefinedVariable]
            project_ref_id=old_project.ref_id,
        )
        for milestone in milestones:
            milestone = milestone.update(
                ctx,
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                name=UpdateAction.do_nothing(),
                date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Milestone).save(milestone)
            await progress_reporter.mark_updated(milestone)

        chapters = await uow.get_for(
            Chapter
        ).find_all_generic(  # pyright: ignore[reportUndefinedVariable]
            project_ref_id=old_project.ref_id,
        )
        milestone_dates_by_ref_id = {
            milestone.ref_id: milestone.date for milestone in milestones
        }
        for chapter in chapters:
            chapter = chapter.update(
                ctx,
                birthday=life_plan.birthday_date,
                milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                name=UpdateAction.do_nothing(),
                start_date=UpdateAction.do_nothing(),
                end_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Chapter).save(chapter)
            await progress_reporter.mark_updated(chapter)
