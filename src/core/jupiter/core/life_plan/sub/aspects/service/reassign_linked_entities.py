"""Service for reassigning linked entities."""

from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.time_plans.life_plan_links import (
    TimePlanAspectLinkRepository,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction


class AspectReassignLinkedEntitiesService:
    """Service for reassigning linked entities."""

    async def reassign_linked_entities(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        workspace: Workspace,
        old_aspect: Aspect,
        new_aspect: Aspect,
    ) -> None:
        """Reassign linked entities."""
        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        await uow.get(TimePlanAspectLinkRepository).remove_all_for_aspect(
            old_aspect.ref_id
        )

        # Unlink from Projects
        project_collection = await uow.get_for(ProjectCollection).load_by_parent(
            workspace.ref_id
        )
        projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=project_collection.ref_id,
            allow_archived=True,
            aspect_ref_id=old_aspect.ref_id,
        )

        projects_by_ref_id = {project.ref_id: project for project in projects}
        for project in projects:
            updated_project = project.update(
                ctx,
                name=UpdateAction.do_nothing(),
                status=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.change_to(new_aspect.ref_id),
                chapter_ref_id=UpdateAction.do_nothing(),
                goal_ref_id=UpdateAction.do_nothing(),
                is_key=UpdateAction.do_nothing(),
                eisen=UpdateAction.do_nothing(),
                difficulty=UpdateAction.do_nothing(),
                actionable_date=UpdateAction.do_nothing(),
                due_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Project).save(updated_project)
            await progress_reporter.mark_updated(updated_project)
            projects_by_ref_id[project.ref_id] = updated_project

        # Unlink from Chores
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id
        )
        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=True,
            aspect_ref_id=old_aspect.ref_id,
        )
        chores_by_ref_id = {chore.ref_id: chore for chore in chores}
        for chore in chores:
            updated_chore = chore.update(
                ctx,
                name=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.change_to(new_aspect.ref_id),
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
            aspect_ref_id=old_aspect.ref_id,
        )
        habits_by_ref_id = {habit.ref_id: habit for habit in habits}
        for habit in habits:
            updated_habit = habit.update(
                ctx,
                name=UpdateAction.do_nothing(),
                aspect_ref_id=UpdateAction.change_to(new_aspect.ref_id),
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

        milestones = await uow.get_for(
            Milestone
        ).find_all_generic(  # pyright: ignore[reportUndefinedVariable]
            aspect_ref_id=old_aspect.ref_id,
        )
        for milestone in milestones:
            milestone = milestone.update(
                ctx,
                aspect_ref_id=UpdateAction.change_to(new_aspect.ref_id),
                name=UpdateAction.do_nothing(),
                date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Milestone).save(milestone)
            await progress_reporter.mark_updated(milestone)

        chapters = await uow.get_for(
            Chapter
        ).find_all_generic(  # pyright: ignore[reportUndefinedVariable]
            aspect_ref_id=old_aspect.ref_id,
        )
        milestone_dates_by_ref_id = {
            milestone.ref_id: milestone.date for milestone in milestones
        }
        for chapter in chapters:
            chapter = chapter.update(
                ctx,
                birthday=life_plan.birthday_date,
                milestone_dates_by_ref_id=milestone_dates_by_ref_id,
                aspect_ref_id=UpdateAction.change_to(new_aspect.ref_id),
                name=UpdateAction.do_nothing(),
                start_date=UpdateAction.do_nothing(),
                end_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Chapter).save(chapter)
            await progress_reporter.mark_updated(chapter)
