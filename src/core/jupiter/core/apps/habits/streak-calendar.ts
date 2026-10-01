import { InboxTaskStatus } from "@jupiter/webapi-client";

export interface StreakInactivePeriodRange {
  start_date: string;
  end_date: string;
  name?: string | null;
  archived?: boolean;
}

export interface StreakMarkStatuses {
  date: string;
  statuses: Record<string, InboxTaskStatus>;
}

export type DayCellKind =
  | "today"
  | "future"
  | "inactive"
  | "doneness"
  | "missing";

function periodCountsAsInactive(period: StreakInactivePeriodRange): boolean {
  return period.archived !== true;
}

export function isInactiveOnDate(
  date: string,
  periods: StreakInactivePeriodRange[],
): boolean {
  return periods.some(
    (period) =>
      periodCountsAsInactive(period) &&
      period.start_date <= date &&
      date <= period.end_date,
  );
}

export function inactiveReasonLabel(
  date: string,
  periods: StreakInactivePeriodRange[],
): string | null {
  const reasons = periods
    .filter(
      (period) =>
        periodCountsAsInactive(period) &&
        period.start_date <= date &&
        date <= period.end_date,
    )
    .map((period) => period.name?.trim())
    .filter(
      (reason): reason is string => reason !== undefined && reason !== "",
    );
  if (reasons.length === 0) {
    return null;
  }
  return reasons.join(", ");
}

export function dayCellKind(input: {
  isToday: boolean;
  isFuture: boolean;
  isInactive: boolean;
  doneness: number | undefined;
}): DayCellKind {
  if (input.isToday) {
    return "today";
  }
  if (input.isFuture) {
    return "future";
  }
  if (input.isInactive) {
    return "inactive";
  }
  if (input.doneness === undefined) {
    return "missing";
  }
  return "doneness";
}

export function computeDonenessForStreakMark(
  statuses: Record<string, InboxTaskStatus>,
): number {
  let doneStatuses = 0;
  let allStatuses = 0;
  for (const status of Object.values(statuses)) {
    if (status === InboxTaskStatus.DONE) {
      doneStatuses++;
    }
    allStatuses++;
  }
  if (allStatuses === 0) {
    return 0;
  }
  return Math.floor((doneStatuses / allStatuses) * 100);
}

export interface WeekCellState {
  fullyInactive: boolean;
  doneness: number | undefined;
}

export function weekCellState(
  weekDays: string[],
  marks: StreakMarkStatuses[],
  periods: StreakInactivePeriodRange[],
): WeekCellState {
  const fullyInactive =
    weekDays.length > 0 &&
    weekDays.every((day) => isInactiveOnDate(day, periods));
  if (fullyInactive) {
    return { fullyInactive: true, doneness: undefined };
  }

  const weekDaySet = new Set(weekDays);
  const merged: Record<string, InboxTaskStatus> = {};
  for (const mark of marks) {
    if (!weekDaySet.has(mark.date) || isInactiveOnDate(mark.date, periods)) {
      continue;
    }
    Object.assign(merged, mark.statuses);
  }
  if (Object.keys(merged).length === 0) {
    return { fullyInactive: false, doneness: undefined };
  }
  return {
    fullyInactive: false,
    doneness: computeDonenessForStreakMark(merged),
  };
}
