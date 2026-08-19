"""Shared domain objects."""

from collections.abc import Callable, Iterator

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.core.common.schedules import Schedule, get_schedule
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import CompositeValue, value


@value
class RecurringTaskGenParams(CompositeValue):
    """Parameters for metric collection."""

    period: RecurringTaskPeriod
    eisen: Eisen
    difficulty: Difficulty
    actionable_from_day: RecurringTaskDueAtDay | None
    actionable_from_month: RecurringTaskDueAtMonth | None
    due_at_day: RecurringTaskDueAtDay | None
    due_at_month: RecurringTaskDueAtMonth | None
    skip_rule: RecurringTaskSkipRule | None

    def _validate(self) -> None:
        the_actionable_from_day = (
            self.actionable_from_day or RecurringTaskDueAtDay.first_of(self.period)
        )
        the_due_at_day = self.due_at_day or RecurringTaskDueAtDay.end_of(self.period)
        if (
            self.period is RecurringTaskPeriod.DAILY
            or self.period is RecurringTaskPeriod.WEEKLY
            or self.period is RecurringTaskPeriod.MONTHLY
        ):
            if the_actionable_from_day.as_int() > the_due_at_day.as_int():
                raise InputValidationError(
                    f"Actionable day {the_actionable_from_day} should be before due day {the_due_at_day}",
                )
        the_actionable_from_month = (
            self.actionable_from_month or RecurringTaskDueAtMonth.first_of(self.period)
        )
        the_due_at_month = self.due_at_month or RecurringTaskDueAtMonth.end_of(
            self.period
        )
        if the_actionable_from_month.as_int() > the_due_at_month.as_int():
            raise InputValidationError(
                f"Actionable month {the_actionable_from_month} should be before due month {the_due_at_month}",
            )
        if (
            the_actionable_from_month == the_due_at_month
            and the_actionable_from_day.as_int() > the_due_at_day.as_int()
        ):
            raise InputValidationError(
                f"Actionable day {the_actionable_from_day} should be before due day {the_due_at_day}",
            )

        if self.skip_rule is not None:
            if not self.skip_rule.is_compatible_with(self.period):
                raise InputValidationError(
                    f"Skip rule {self.skip_rule} is not compatible with period {self.period}",
                )

    def _kept_schedules_in_range(
        self,
        time_plan_start_date: ADate,
        time_plan_end_date: ADate,
        name: EntityName,
    ) -> Iterator[Schedule]:
        """Yield schedules gen would keep over a time plan interval."""
        current_date = time_plan_start_date
        while current_date <= time_plan_end_date:
            schedule = get_schedule(
                self.period,
                name,
                current_date.to_timestamp_at_end_of_day(),
                self.skip_rule,
                self.actionable_from_day,
                self.actionable_from_month,
                self.due_at_day,
                self.due_at_month,
            )
            if schedule.should_keep:
                yield schedule
            current_date = schedule.end_day.next_day()

    def would_generate_in_time_plan(
        self,
        time_plan_start_date: ADate,
        time_plan_end_date: ADate,
        name: EntityName,
        schedule_keep_predicate: Callable[[Schedule], bool] | None = None,
    ) -> bool:
        """Whether gen would create a task over a time plan interval."""
        for schedule in self._kept_schedules_in_range(
            time_plan_start_date, time_plan_end_date, name
        ):
            if schedule_keep_predicate is not None and not schedule_keep_predicate(
                schedule
            ):
                continue
            return True
        return False
