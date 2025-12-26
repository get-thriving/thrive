"""Service for reassigning linked entities."""

from jupiter.core.journals.collection import JournalCollection
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.aspects.service.check_cycles import (
    ProjectCheckCyclesService,
    ProjectTreeHasCyclesError,
)
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.persons.collection import PersonCollection
from jupiter.core.push_integrations.group import PushIntegrationGroup
from jupiter.core.push_integrations.sub.email.task_collection import EmailTaskCollection
from jupiter.core.push_integrations.sub.slack.task_collection import SlackTaskCollection
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.working_mem.collection import WorkingMemCollection
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.context import MutationContext
from jupiter.framework.errors import InputValidationError
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

        person_collection = await uow.get_for(PersonCollection).load_by_parent(
            workspace.ref_id
        )
        if person_collection.catch_up_project_ref_id == old_project.ref_id:
            person_collection = person_collection.change_catch_up_project(
                ctx,
                new_project.ref_id,
            )
            await uow.get_for(PersonCollection).save(person_collection)

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

        life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

        child_projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=True,
            parent_project_ref_id=old_project.ref_id,
        )
        for child_project in child_projects:
            child_project = child_project.change_parent(ctx, new_project.ref_id)

            await uow.get_for(Project).save(child_project)
            await progress_reporter.mark_updated(child_project)

            try:
                await ProjectCheckCyclesService().check_for_cycles(uow, child_project)
            except ProjectTreeHasCyclesError as err:
                raise InputValidationError("The project tree has cycles.") from err

        chapters = await uow.get_for(
            Chapter
        ).find_all_generic(  # pyright: ignore[reportUndefinedVariable]
            project_ref_id=old_project.ref_id,
        )
        for chapter in chapters:
            chapter = chapter.update(
                ctx,
                birthday=life_plan.birthday_date,
                name=UpdateAction.do_nothing(),
                project_ref_id=UpdateAction.change_to(new_project.ref_id),
                start_date=UpdateAction.do_nothing(),
                end_date=UpdateAction.do_nothing(),
            )
            await uow.get_for(Chapter).save(chapter)
            await progress_reporter.mark_updated(chapter)

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
