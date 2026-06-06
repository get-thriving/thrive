import type { ADate, TimePlan } from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";

import { aDateToDate, compareADate } from "#/core/common/adate";
import { comparePeriods } from "#/core/common/recurring-task-period";

export function timePlanAllowsProjects(_timePlan: TimePlan): boolean {
  return true;
}

export function timePlanAllowsInboxTasks(timePlan: TimePlan): boolean {
  return (
    timePlan.period === RecurringTaskPeriod.DAILY ||
    timePlan.period === RecurringTaskPeriod.WEEKLY
  );
}

export function timePlanAllowsKanbanViews(timePlan: TimePlan): boolean {
  // Kanban views show inbox tasks, so they're only available for daily and weekly periods
  return timePlanAllowsInboxTasks(timePlan);
}

export function findTimePlansThatAreActive(
  timePlans: Array<TimePlan>,
  rightNow: ADate,
): TimePlan[] {
  const rightNowDate = aDateToDate(rightNow);
  return timePlans.filter((timePlan) => {
    const startDate = aDateToDate(timePlan.start_date);
    const endDate = aDateToDate(timePlan.end_date);
    return startDate <= rightNowDate && rightNowDate <= endDate;
  });
}

export function sortTimePlansNaturally(timePlans: Array<TimePlan>): TimePlan[] {
  return [...timePlans].sort((j1, j2) => {
    if (j2.archived && !j1.archived) {
      return -1;
    }

    if (j1.archived && !j2.archived) {
      return 1;
    }

    return (
      -1 * compareADate(j1.right_now, j2.right_now) ||
      comparePeriods(j1.period, j2.period)
    );
  });
}
