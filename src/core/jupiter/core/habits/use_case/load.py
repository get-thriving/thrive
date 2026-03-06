"""Use case for loading a particular habit."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import Task, TaskRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class HabitLoadArgs(UseCaseArgsBase):
    """HabitLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    task_retrieve_offset: int | None
    include_streak_marks_earliest_date: ADate | None
    include_streak_marks_latest_date: ADate | None


@use_case_result
class HabitLoadResult(UseCaseResultBase):
    """HabitLoadResult."""

    habit: Habit
    project: Project
    chapter: Chapter | None
    goal: Goal | None
    tasks: list[Task]
    tasks_total_cnt: int
    tasks_page_size: int
    streak_marks: list[HabitStreakMark]
    streak_mark_earliest_date: ADate
    streak_mark_latest_date: ADate
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None


@readonly_use_case(WorkspaceFeature.HABITS)
class HabitLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[HabitLoadArgs, HabitLoadResult]
):
    """Use case for loading a particular habit."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HabitLoadArgs,
    ) -> HabitLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        if args.task_retrieve_offset is not None and args.task_retrieve_offset < 0:
            raise InputValidationError("Invalid task_retrieve_offset")
        if (
            args.include_streak_marks_earliest_date is not None
            and args.include_streak_marks_latest_date is not None
            and args.include_streak_marks_earliest_date
            > args.include_streak_marks_latest_date
        ):
            raise InputValidationError(
                "Invalid streak_mark_earliest_date or streak_mark_latest_date"
            )

        workspace = context.workspace
        habit = await uow.get_for(Habit).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        project = await uow.get_for(Project).load_by_id(habit.project_ref_id)
        chapter = (
            await uow.get_for(Chapter).load_by_id(habit.chapter_ref_id)
            if habit.chapter_ref_id
            else None
        )
        goal = (
            await uow.get_for(Goal).load_by_id(habit.goal_ref_id)
            if habit.goal_ref_id
            else None
        )
        task_domain = await uow.get_for(TaskDomain).load_by_parent(
            workspace.ref_id,
        )

        tasks_total_cnt = await uow.get(TaskRepository).count_all_for_source(
            parent_ref_id=task_domain.ref_id,
            allow_archived=allow_archived,
            namespace=TaskNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )
        tasks = await uow.get(
            TaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=task_domain.ref_id,
            allow_archived=True,
            namespace=TaskNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
            retrieve_offset=args.task_retrieve_offset or 0,
            retrieve_limit=TaskRepository.PAGE_SIZE,
        )

        streak_mark_earliest_date = (
            args.include_streak_marks_earliest_date
            or self._time_provider.get_current_date().subtract_days(365)
        )
        streak_mark_latest_date = (
            args.include_streak_marks_latest_date
            or self._time_provider.get_current_date()
        )

        streak_marks = await uow.get(HabitStreakMarkRepository).find_all_between_dates(
            habit.ref_id,
            streak_mark_earliest_date,
            streak_mark_latest_date,
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_link = await uow.get(
            ContactLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=ContactNamespace.HABIT,
            source_entity_ref_id=habit.ref_id,
        )
        if contact_link is not None:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_link.contacts_ref_ids,
            )
        else:
            contacts = []

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.HABIT,
            habit.ref_id,
            allow_archived=allow_archived,
        )

        return HabitLoadResult(
            habit=habit,
            project=project,
            chapter=chapter,
            goal=goal,
            tasks=tasks,
            tasks_total_cnt=tasks_total_cnt,
            tasks_page_size=TaskRepository.PAGE_SIZE,
            streak_marks=streak_marks,
            streak_mark_earliest_date=streak_mark_earliest_date,
            streak_mark_latest_date=streak_mark_latest_date,
            tags=tags,
            contacts=contacts,
            note=note,
        )
