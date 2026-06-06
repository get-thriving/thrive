"""Shared module for removing a project."""

from jupiter.core.projects.root import Project
from jupiter.core.projects.stats import ProjectStatsRepository
from jupiter.core.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivityRespository,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class ProjectRemoveService:
    """Shared service for removing a project."""

    async def remove(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        reporter: ProgressReporter,
        workspace: Workspace,
        ref_id: EntityId,
    ) -> None:
        """Hard remove a project."""
        project = await uow.get_for(Project).load_by_id(
            ref_id,
            allow_archived=True,
        )

        milestones = await uow.get_for(ProjectMilestone).find_all_generic(
            parent_ref_id=project.ref_id,
            allow_archived=True,
        )
        for milestone in milestones:
            await uow.get_for(ProjectMilestone).remove(ctx, milestone.ref_id)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_tasks_to_remove = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            owner=EntityLink.std(NamedEntityTag.PROJECT.value, ref_id),
        )

        if len(inbox_tasks_to_remove) > 0:
            time_plan_activities_for_inbox_tasks = await uow.get(
                TimePlanActivityRespository
            ).find_all_generic(
                target=[
                    EntityLink.std("InboxTask", it.ref_id)
                    for it in inbox_tasks_to_remove
                ],
                allow_archived=True,
            )
            for time_plan_activity in time_plan_activities_for_inbox_tasks:
                await uow.get(TimePlanActivityRespository).remove(
                    ctx,
                    time_plan_activity.ref_id,
                )

        for inbox_task in inbox_tasks_to_remove:
            await uow.get_for(InboxTask).remove(ctx, inbox_task.ref_id)

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
        )

        time_plan_activities_for_project = await uow.get(
            TimePlanActivityRespository
        ).find_all_generic(
            target=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            allow_archived=True,
        )
        for time_plan_activity in time_plan_activities_for_project:
            await uow.get(TimePlanActivityRespository).remove(
                ctx,
                time_plan_activity.ref_id,
            )

        await uow.get(ProjectStatsRepository).remove(project.ref_id)

        project = await uow.get_for(Project).remove(ctx, ref_id)
        await reporter.mark_removed(project)
