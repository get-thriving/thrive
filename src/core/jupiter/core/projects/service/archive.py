"""Shared logic for archiving a project."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project
from jupiter.core.projects.sub.milestones.root import ProjectMilestone
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.value import CompositeValue, value


@value
class ProjectArchiveServiceResult(CompositeValue):
    """The result of the archive operation."""

    archived_inbox_tasks: list[InboxTask]


class ProjectArchiveService:
    """Shared logic for archiving a project."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        project: Project,
        archival_reason: JupiterArchivalReason,
    ) -> ProjectArchiveServiceResult:
        """Execute the service's action."""
        if project.archived:
            return ProjectArchiveServiceResult(archived_inbox_tasks=[])

        project_collection = await uow.get_for(ProjectCollection).load_by_id(
            project.project_collection.ref_id,
        )

        milestones = await uow.get_for(ProjectMilestone).find_all_generic(
            parent_ref_id=project.ref_id,
            allow_archived=False,
        )

        for milestone in milestones:
            milestone = milestone.mark_archived(ctx, archival_reason)
            await uow.get_for(ProjectMilestone).save(milestone)
            await progress_reporter.mark_updated(milestone)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            project_collection.workspace.ref_id,
        )
        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            owner=EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            allow_archived=True,
        )

        archived_inbox_tasks = []

        inbox_task_archive_service = InboxTaskArchiveService()
        for inbox_task in inbox_tasks_to_archive:
            if inbox_task.archived:
                continue
            await inbox_task_archive_service.do_it(
                ctx, uow, inbox_task, archival_reason
            )
            archived_inbox_tasks.append(inbox_task)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            archival_reason,
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.PROJECT.value, project.ref_id),
            archival_reason,
        )

        project = project.mark_archived(ctx, archival_reason)
        await uow.get_for(Project).save(project)
        await progress_reporter.mark_updated(project)

        return ProjectArchiveServiceResult(archived_inbox_tasks=archived_inbox_tasks)
