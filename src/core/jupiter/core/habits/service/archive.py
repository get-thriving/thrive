"""Shared service for archiving a habit."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitArchiveService:
    """Shared service for archiving a habit."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        habit: Habit,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the service's action.

        Callers must have already authorized write access to the habit via ACL.
        """
        if habit.archived:
            return

        habit_collection = await uow.get_for(HabitCollection).load_by_id(
            habit.habit_collection.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            habit_collection.workspace.ref_id,
        )
        inbox_tasks_to_archive = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=False,
            owner=EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )

        inbox_task_archive_service = InboxTaskArchiveService()

        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_archive_service.do_it(
                ctx, uow, inbox_task, archival_reason
            )

        habit = habit.mark_archived(ctx, archival_reason)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
            archival_reason,
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
            archival_reason,
        )
