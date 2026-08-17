import { RecurringTaskPeriod } from "@jupiter/webapi-client";
import type { DateTime } from "luxon";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function monthToQuarter(month: number): string {
  return `Q${Math.ceil(month / 3)}`;
}

function monthToMonth(month: number): string {
  return MONTH_NAMES[month - 1];
}

function startOfIsoWeek(rightNow: DateTime): DateTime {
  return rightNow.minus({ days: rightNow.weekday - 1 }).startOf("day");
}

/**
 * Infer the timeline for a recurring task.
 * Keep in sync with Python ``jupiter.core.common.timeline.infer_timeline``.
 */
export function inferTimeline(
  period: RecurringTaskPeriod,
  rightNow: DateTime,
): string {
  switch (period) {
    case RecurringTaskPeriod.DAILY: {
      const year = `${rightNow.year}`;
      const quarter = monthToQuarter(rightNow.month);
      const month = monthToMonth(rightNow.month);
      const week = `W${rightNow.weekNumber}`;
      const day = `D${rightNow.weekday}`;
      return `${year},${quarter},${month},${week},${day}`;
    }
    case RecurringTaskPeriod.WEEKLY: {
      const startOfWeek = startOfIsoWeek(rightNow);
      const year = `${startOfWeek.year}`;
      const quarter = monthToQuarter(startOfWeek.month);
      const month = monthToMonth(startOfWeek.month);
      let week = `W${startOfWeek.weekNumber}`;
      if (startOfWeek.month === 12 && startOfWeek.weekNumber === 1) {
        week = "W53";
      }
      return `${year},${quarter},${month},${week}`;
    }
    case RecurringTaskPeriod.MONTHLY: {
      const startOfMonth = rightNow.startOf("month");
      const year = `${startOfMonth.year}`;
      const quarter = monthToQuarter(startOfMonth.month);
      const month = monthToMonth(startOfMonth.month);
      return `${year},${quarter},${month}`;
    }
    case RecurringTaskPeriod.QUARTERLY: {
      const year = `${rightNow.year}`;
      const quarter = monthToQuarter(rightNow.month);
      return `${year},${quarter}`;
    }
    case RecurringTaskPeriod.YEARLY:
      return `${rightNow.year}`;
  }
}
