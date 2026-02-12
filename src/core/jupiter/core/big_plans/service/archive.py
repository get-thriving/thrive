"""Shared logic for archiving a big plan."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.value import CompositeValue, value


@value
class BigPlanArchiveServiceResult(CompositeValue):
    """The result of the archive operation."""

    archived_inbox_tasks: list[InboxTask]


class BigPlanArchiveService:
    """Shared logic for archiving a big plan."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        big_plan: BigPlan,
        archival_reason: JupiterArchivalReason,
    ) -> BigPlanArchiveServiceResult:
        """Execute the service's action."""
        if big_plan.archived:
            return BigPlanArchiveServiceResult(archived_inbox_tasks=[])

        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_id(
            big_plan.big_plan_collection.ref_id,
        )

        milestones = await uow.get_for(BigPlanMilestone).find_all_generic(
            parent_ref_id=big_plan.ref_id,
            allow_archived=False,
        )

        for milestone in milestones:
            milestone = milestone.mark_archived(ctx, archival_reason)
            await uow.get_for(BigPlanMilestone).save(milestone)
            await progress_reporter.mark_updated(milestone)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            big_plan_collection.workspace.ref_id,
        )
        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            source_entity_ref_id=big_plan.ref_id,
            source=InboxTaskSource.BIG_PLAN,
            allow_archived=True,
        )

        archived_inbox_tasks = []

        inbox_task_archive_service = InboxTaskArchiveService()
        for inbox_task in inbox_tasks_to_archive:
            if inbox_task.archived:
                continue
            await inbox_task_archive_service.do_it(
                ctx, uow, progress_reporter, inbox_task, archival_reason
            )
            archived_inbox_tasks.append(inbox_task)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            ctx, uow, NoteNamespace.BIG_PLAN, big_plan.ref_id, archival_reason
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx, uow, TagNamespace.BIG_PLAN, big_plan.ref_id, archival_reason
        )

        big_plan = big_plan.mark_archived(ctx, archival_reason)
        await uow.get_for(BigPlan).save(big_plan)
        await progress_reporter.mark_updated(big_plan)

        return BigPlanArchiveServiceResult(archived_inbox_tasks=archived_inbox_tasks)
