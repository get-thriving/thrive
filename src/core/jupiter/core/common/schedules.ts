import type { ADate, RecurringTaskGenParams } from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import type { DateTime } from "luxon";

import { aDateToDate, dateToAdate } from "#/core/common/adate";
import { skipRuleShouldKeep } from "#/core/common/recurring-task-skip-rule";

function quarterStartMonth(month: number): number {
  return Math.floor((month - 1) / 3) * 3 + 1;
}

function advanceOnePeriod(
  date: DateTime,
  period: RecurringTaskPeriod,
): DateTime {
  switch (period) {
    case RecurringTaskPeriod.DAILY:
      return date.plus({ days: 1 });
    case RecurringTaskPeriod.WEEKLY:
      return date.plus({ weeks: 1 });
    case RecurringTaskPeriod.MONTHLY:
      return date.plus({ months: 1 });
    case RecurringTaskPeriod.QUARTERLY:
      return date.plus({ months: 3 });
    case RecurringTaskPeriod.YEARLY:
      return date.plus({ years: 1 });
  }
}

/**
 * Due date for the period containing ``rightNow``, matching Python ``get_schedule``.
 */
export function dueDateFromGenParams(
  genParams: RecurringTaskGenParams,
  rightNow: DateTime,
): ADate {
  const dueAtDay = genParams.due_at_day ?? null;
  const dueAtMonth = genParams.due_at_month ?? null;

  switch (genParams.period) {
    case RecurringTaskPeriod.DAILY:
      return dateToAdate(rightNow.startOf("day"));
    case RecurringTaskPeriod.WEEKLY: {
      const startOfWeek = rightNow
        .minus({ days: rightNow.weekday - 1 })
        .startOf("day");
      if (dueAtDay) {
        return dateToAdate(startOfWeek.plus({ days: dueAtDay - 1 }));
      }
      return dateToAdate(startOfWeek.plus({ days: 6 }));
    }
    case RecurringTaskPeriod.MONTHLY: {
      const startOfMonth = rightNow.startOf("month");
      if (dueAtDay) {
        return dateToAdate(startOfMonth.plus({ days: dueAtDay - 1 }));
      }
      return dateToAdate(startOfMonth.endOf("month").startOf("day"));
    }
    case RecurringTaskPeriod.QUARTERLY: {
      const startMonth = quarterStartMonth(rightNow.month);
      const quarterStart = rightNow
        .set({ month: startMonth, day: 1 })
        .startOf("day");
      if (dueAtMonth) {
        const monthDate = quarterStart.plus({ months: dueAtMonth - 1 });
        if (dueAtDay) {
          return dateToAdate(monthDate.plus({ days: dueAtDay - 1 }));
        }
        return dateToAdate(monthDate.endOf("month").startOf("day"));
      }
      if (dueAtDay) {
        return dateToAdate(quarterStart.plus({ days: dueAtDay - 1 }));
      }
      const quarterEnd = rightNow
        .set({ month: startMonth + 2, day: 1 })
        .endOf("month")
        .startOf("day");
      return dateToAdate(quarterEnd);
    }
    case RecurringTaskPeriod.YEARLY: {
      const yearStart = rightNow.startOf("year");
      if (dueAtMonth) {
        const monthDate = yearStart.plus({ months: dueAtMonth - 1 });
        if (dueAtDay) {
          return dateToAdate(monthDate.plus({ days: dueAtDay - 1 }));
        }
        return dateToAdate(monthDate.endOf("month").startOf("day"));
      }
      if (dueAtDay) {
        return dateToAdate(yearStart.plus({ days: dueAtDay - 1 }));
      }
      return dateToAdate(yearStart.endOf("year").startOf("day"));
    }
  }
}

/**
 * Next due date on or after today, skipping gen-param skip-rule periods.
 */
export function upcomingDueDateFromGenParams(
  genParams: RecurringTaskGenParams,
  today: ADate,
): ADate {
  const todayDate = aDateToDate(today).startOf("day");
  let cursor = todayDate;

  for (let i = 0; i < 24; i++) {
    const due = dueDateFromGenParams(genParams, cursor);
    const dueDate = aDateToDate(due).startOf("day");
    const keep = skipRuleShouldKeep(
      genParams.skip_rule,
      genParams.period,
      dueDate,
    );
    if (keep && dueDate >= todayDate) {
      return due;
    }
    cursor = advanceOnePeriod(cursor, genParams.period);
  }

  return dueDateFromGenParams(genParams, cursor);
}
