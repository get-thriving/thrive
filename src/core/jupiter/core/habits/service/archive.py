"""Shared service for archiving a habit."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import TaskRepository
from jupiter.core.common.sub.tasks.service.archive import TaskArchiveService
from jupiter.core.common.sub.notes.service.archive import (
    NoteArchiveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.archive import TagLinkArchiveService
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
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
        task_domain = await uow.get_for(TaskDomain).load_by_parent(
            habit_collection.workspace.ref_id,
        )
        tasks_to_archive = await uow.get(
            TaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=task_domain.ref_id,
            allow_archived=False,
            namespace=TaskNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )

        task_archive_service = TaskArchiveService()

        for task in tasks_to_archive:
            await task_archive_service.archive(
                ctx, uow, task, archival_reason
            )

        habit = habit.mark_archived(ctx, archival_reason)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)

        note_archive_service = NoteArchiveService()
        await note_archive_service.archive_for_source(
            ctx, uow, NoteNamespace.HABIT, habit.ref_id, archival_reason
        )

        tag_link_archive_service = TagLinkArchiveService()
        await tag_link_archive_service.archive_for_entity(
            ctx, uow, TagNamespace.HABIT, habit.ref_id, archival_reason
        )
