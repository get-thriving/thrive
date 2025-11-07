"""Shared service for removing a habit."""

from jupiter.core.common.notes.domain import NoteDomain
from jupiter.core.common.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMarkRepository,
)
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTaskRepository
from jupiter.core.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitRemoveService:
    """Shared service for removing a habit."""

    async def remove(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        ref_id: EntityId,
    ) -> None:
        """Hard remove a habit."""
        habit = await uow.get_for(Habit).load_by_id(ref_id, allow_archived=True)
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
            allow_archived=True,
            source=InboxTaskSource.HABIT,
            source_entity_ref_id=habit.ref_id,
        )

        inbox_task_remove_service = InboxTaskRemoveService()

        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            ctx, uow, NoteDomain.HABIT, habit.ref_id
        )

        all_streak_marks = await uow.get(HabitStreakMarkRepository).find_all(
            habit.ref_id
        )
        for streak_mark in all_streak_marks:
            await uow.get(HabitStreakMarkRepository).remove(
                (streak_mark.habit.ref_id, streak_mark.date)
            )

        await uow.get_for(Habit).remove(ref_id)
        await progress_reporter.mark_removed(habit)
