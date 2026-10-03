"""Find the streaks of several habits at once."""

from collections import defaultdict

from jupiter.core.apps.habits.streak_mark import (
    HabitStreakMark,
    HabitStreakMarkRepository,
)
from jupiter.core.apps.habits.sub.habit.root import Habit
from jupiter.core.apps.habits.sub.streak_inactive_period.root import (
    HabitStreakInactivePeriod,
    HabitStreakInactivePeriodRepository,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class HabitFindStreaksArgs(JupiterFindCrownEntityArgs):
    """HabitFindStreaksArgs."""

    filter_ref_ids: list[EntityId] | None
    filter_only_key: bool | None
    include_streak_marks_earliest_date: ADate | None
    include_streak_marks_latest_date: ADate | None


@use_case_result_part
class HabitFindStreaksResultEntry(UseCaseResultBase):
    """The streak of a single habit."""

    habit: Habit
    streak_marks: list[HabitStreakMark]
    streak_inactive_periods: list[HabitStreakInactivePeriod]


@use_case_result
class HabitFindStreaksResult(UseCaseResultBase):
    """HabitFindStreaksResult."""

    streak_mark_earliest_date: ADate
    streak_mark_latest_date: ADate
    entries: list[HabitFindStreaksResultEntry]


@readonly_use_case(WorkspaceFeature.HABITS)
class HabitFindStreaksUseCase(
    JupiterFindCrownEntityUseCase[HabitFindStreaksArgs, HabitFindStreaksResult]
):
    """Find the streaks of several habits at once.

    A lighter alternative to loading each habit just to draw its streak, with
    a constant number of queries however many habits there are.
    """

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: HabitFindStreaksArgs,
    ) -> HabitFindStreaksResult:
        """Execute the command's action."""
        streak_mark_earliest_date = (
            args.include_streak_marks_earliest_date
            or self._time_provider.get_current_date().subtract_days(365)
        )
        streak_mark_latest_date = (
            args.include_streak_marks_latest_date
            or self._time_provider.get_current_date()
        )
        if streak_mark_earliest_date > streak_mark_latest_date:
            raise InputValidationError(
                "Invalid streak_mark_earliest_date or streak_mark_latest_date"
            )

        habits = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Habit,
            allow_archived=False,
            filter_ref_ids=args.filter_ref_ids,
        )
        if args.filter_only_key:
            habits = [h for h in habits if h.is_key]
        if not habits:
            return HabitFindStreaksResult(
                streak_mark_earliest_date=streak_mark_earliest_date,
                streak_mark_latest_date=streak_mark_latest_date,
                entries=[],
            )

        habit_ref_ids = [h.ref_id for h in habits]

        streak_marks = await uow.get(
            HabitStreakMarkRepository
        ).find_all_for_habits_between_dates(
            habit_ref_ids,
            streak_mark_earliest_date,
            streak_mark_latest_date,
        )
        streak_marks_by_habit_ref_id: defaultdict[EntityId, list[HabitStreakMark]] = (
            defaultdict(list)
        )
        for mark in streak_marks:
            streak_marks_by_habit_ref_id[mark.habit.ref_id].append(mark)

        streak_inactive_periods = await uow.get(
            HabitStreakInactivePeriodRepository
        ).find_all_for_habits_overlapping(
            habit_ref_ids,
            streak_mark_earliest_date,
            streak_mark_latest_date,
            allow_archived=True,
        )
        streak_inactive_periods.sort(
            key=lambda period: (period.start_date, period.end_date)
        )
        streak_inactive_periods_by_habit_ref_id: defaultdict[
            EntityId, list[HabitStreakInactivePeriod]
        ] = defaultdict(list)
        for period in streak_inactive_periods:
            streak_inactive_periods_by_habit_ref_id[period.habit.ref_id].append(period)

        return HabitFindStreaksResult(
            streak_mark_earliest_date=streak_mark_earliest_date,
            streak_mark_latest_date=streak_mark_latest_date,
            entries=[
                HabitFindStreaksResultEntry(
                    habit=habit,
                    streak_marks=streak_marks_by_habit_ref_id[habit.ref_id],
                    streak_inactive_periods=streak_inactive_periods_by_habit_ref_id[
                        habit.ref_id
                    ],
                )
                for habit in habits
            ],
        )
