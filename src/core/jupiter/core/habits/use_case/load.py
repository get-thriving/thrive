"""Use case for loading a particular habit."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.load import HabitLoadResult, HabitLoadService
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    use_case_args,
)

__all__ = ["HabitLoadArgs", "HabitLoadResult", "HabitLoadUseCase"]


@use_case_args
class HabitLoadArgs(JupiterLoadCrownEntityArgs):
    """HabitLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    inbox_task_retrieve_offset: int | None
    include_streak_marks_earliest_date: ADate | None
    include_streak_marks_latest_date: ADate | None


@readonly_use_case(WorkspaceFeature.HABITS)
class HabitLoadUseCase(JupiterLoadCrownEntityUseCase[HabitLoadArgs, HabitLoadResult]):
    """Use case for loading a particular habit."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HabitLoadArgs,
    ) -> HabitLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

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
        habit = await self.load_entity(
            uow,
            context.user.ref_id,
            Habit,
            args.ref_id,
            allow_archived,
        )

        return await HabitLoadService(self._time_provider).do_it(
            uow,
            workspace.ref_id,
            habit,
            allow_archived=allow_archived,
            inbox_task_retrieve_offset=args.inbox_task_retrieve_offset or 0,
            include_streak_marks_earliest_date=args.include_streak_marks_earliest_date,
            include_streak_marks_latest_date=args.include_streak_marks_latest_date,
        )
