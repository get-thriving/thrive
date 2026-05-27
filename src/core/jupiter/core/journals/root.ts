import type { ADate, Journal } from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";

import { aDateToDate, compareADate } from "#/core/common/adate";
import { comparePeriods } from "#/core/common/recurring-task-period";

export function findJournalsThatAreActive(
  journals: Array<Journal>,
  today: ADate,
): Journal[] {
  const todayDate = aDateToDate(today);

  return journals.filter((journal) => {
    const rightNowDate = aDateToDate(journal.right_now);

    switch (journal.period) {
      case RecurringTaskPeriod.DAILY:
        return rightNowDate.hasSame(todayDate, "day");
      case RecurringTaskPeriod.WEEKLY:
        return rightNowDate.hasSame(todayDate, "week");
      case RecurringTaskPeriod.MONTHLY:
        return rightNowDate.hasSame(todayDate, "month");
      case RecurringTaskPeriod.QUARTERLY:
        return rightNowDate.hasSame(todayDate, "quarter");
      case RecurringTaskPeriod.YEARLY:
        return rightNowDate.hasSame(todayDate, "year");
    }
  });
}

export function sortJournalsNaturally(journals: Array<Journal>): Journal[] {
  return [...journals].sort((j1, j2) => {
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
