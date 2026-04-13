"""Shared service for removing a habit."""

from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMarkRepository,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class HabitRemoveService:
    """Shared service for removing a habit."""

    async def remove(
        self,
        ctx: DomainContext,
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
            namespace=InboxTaskNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )

        inbox_task_remove_service = InboxTaskRemoveService()

        for inbox_task in inbox_tasks_to_archive:
            await inbox_task_remove_service.do_it(
                ctx, uow, progress_reporter, inbox_task
            )

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_owner(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx,
            uow,
            EntityLink.std(NamedEntityTag.HABIT.value, habit.ref_id),
        )

        all_streak_marks = await uow.get(HabitStreakMarkRepository).find_all(
            habit.ref_id
        )
        for streak_mark in all_streak_marks:
            await uow.get(HabitStreakMarkRepository).remove(
                (streak_mark.habit.ref_id, streak_mark.date)
            )

        await uow.get_for(Habit).remove(ctx, ref_id)
        await progress_reporter.mark_removed(habit)
