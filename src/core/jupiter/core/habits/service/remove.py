"""Shared service for removing a habit."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import TaskRepository
from jupiter.core.common.sub.tasks.service.remove import TaskRemoveService
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMarkRepository,
)
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
        task_domain = await uow.get_for(TaskDomain).load_by_parent(
            habit_collection.workspace.ref_id,
        )
        tasks_to_remove = await uow.get(
            TaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=task_domain.ref_id,
            allow_archived=True,
            namespace=TaskNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )

        task_remove_service = TaskRemoveService()

        for task in tasks_to_remove:
            await task_remove_service.remove(ctx, uow, task)
            await progress_reporter.mark_removed(task)

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            ctx, uow, NoteNamespace.HABIT, habit.ref_id
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.HABIT, habit.ref_id
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
