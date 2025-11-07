"""Shared service for archiving a habit."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.notes.domain import NoteDomain
from jupiter.core.common.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTaskRepository
from jupiter.core.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitArchiveService:
    """Shared service for archiving a habit."""

    async def do_it(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        habit: Habit,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Execute the service's action."""
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
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=False,
            source=InboxTaskSource.HABIT,
            source_entity_ref_id=habit.ref_id,
        )

        inbox_task_archive_service = InboxTaskArchiveService()

        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_archive_service.do_it(
                ctx, uow, progress_reporter, inbox_task, archival_reason
            )

        habit = habit.mark_archived(ctx, archival_reason)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            ctx, uow, NoteDomain.HABIT, habit.ref_id, archival_reason
        )
