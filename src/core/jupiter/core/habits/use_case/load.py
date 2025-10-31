"""Use case for loading a particular habit."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domainx.core.notes.note import Note, NoteRepository
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.projects.root import Project
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
    allow_archived: bool
    inbox_task_retrieve_offset: int | None
    include_streak_marks_earliest_date: ADate | None
    include_streak_marks_latest_date: ADate | None


@use_case_result
class HabitLoadResult(UseCaseResultBase):
    """HabitLoadResult."""

    habit: Habit
    project: Project
    inbox_tasks: list[InboxTask]
    inbox_tasks_total_cnt: int
    inbox_tasks_page_size: int
    streak_marks: list[HabitStreakMark]
    streak_mark_earliest_date: ADate
    streak_mark_latest_date: ADate
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
        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")
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
            args.ref_id, allow_archived=args.allow_archived
        )
        project = await uow.get_for(Project).load_by_id(habit.project_ref_id)
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        inbox_tasks_total_cnt = await uow.get(InboxTaskRepository).count_all_for_source(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=args.allow_archived,
            source=InboxTaskSource.HABIT,
            source_entity_ref_id=habit.ref_id,
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.HABIT,
            source_entity_ref_id=habit.ref_id,
            retrieve_offset=args.inbox_task_retrieve_offset or 0,
            retrieve_limit=InboxTaskRepository.PAGE_SIZE,
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

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.HABIT,
            habit.ref_id,
            allow_archived=args.allow_archived,
        )

        return HabitLoadResult(
            habit=habit,
            project=project,
            inbox_tasks=inbox_tasks,
            inbox_tasks_total_cnt=inbox_tasks_total_cnt,
            inbox_tasks_page_size=InboxTaskRepository.PAGE_SIZE,
            streak_marks=streak_marks,
            streak_mark_earliest_date=streak_mark_earliest_date,
            streak_mark_latest_date=streak_mark_latest_date,
            note=note,
        )
