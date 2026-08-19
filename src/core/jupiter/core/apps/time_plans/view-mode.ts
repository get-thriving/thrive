import type { ADate, TimePlan, Workspace } from "@jupiter/webapi-client";
import { RecurringTaskPeriod, WorkspaceFeature } from "@jupiter/webapi-client";

import { TIME_PLAN_GROUPING_PARAM } from "#/core/apps/time_plans/grouping";
import {
  timePlanAllowsCalendarView,
  timePlanAllowsKanbanViews,
} from "#/core/apps/time_plans/root";
import { aDateToDate, allDaysBetween, dateToAdate } from "#/core/common/adate";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

// The ways of looking at the activities of a time plan.
export enum TimePlanViewMode {
  KANBAN_BY_EISEN = "kanban-by-eisen",
  KANBAN = "kanban",
  LIST = "list",
  TIMELINE = "timeline",
  CALENDAR = "calendar",
  CALENDAR_3_DAYS = "calendar-3-days",
}

// How many days the focused weekly calendar shows - today and the two that
// follow, sliding back to the week's last three when there aren't that many
// left (Fri/Sat/Sun stay Fri, Sat, Sun).
const TIME_PLAN_THREE_DAY_CALENDAR_DAYS = 3;

// The view rides along in the URL, so a reload - or coming back from one of
// the panels a time plan opens - lands on the same one. It goes by a name of
// its own rather than plain "view", since some of those panels live in the
// calendar, which keeps a view of its own in the query.
export const TIME_PLAN_VIEW_PARAM = "timePlanView";

export function parseTimePlanViewMode(
  raw: string | null | undefined,
): TimePlanViewMode | undefined {
  for (const viewMode of Object.values(TimePlanViewMode)) {
    if (viewMode === raw) {
      return viewMode;
    }
  }

  return undefined;
}

export function timePlanViewModeIsCalendar(
  viewMode: TimePlanViewMode,
): viewMode is TimePlanViewMode.CALENDAR | TimePlanViewMode.CALENDAR_3_DAYS {
  return (
    viewMode === TimePlanViewMode.CALENDAR ||
    viewMode === TimePlanViewMode.CALENDAR_3_DAYS
  );
}

export function timePlanViewModeIsAllowed(
  viewMode: TimePlanViewMode,
  workspace: Workspace,
  timePlan: TimePlan,
): boolean {
  switch (viewMode) {
    case TimePlanViewMode.KANBAN:
    case TimePlanViewMode.KANBAN_BY_EISEN:
      return timePlanAllowsKanbanViews(timePlan);
    case TimePlanViewMode.CALENDAR:
      return (
        isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SCHEDULE) &&
        timePlanAllowsCalendarView(timePlan)
      );
    case TimePlanViewMode.CALENDAR_3_DAYS:
      return (
        isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.SCHEDULE) &&
        timePlan.period === RecurringTaskPeriod.WEEKLY
      );
    case TimePlanViewMode.LIST:
    case TimePlanViewMode.TIMELINE:
      return true;
  }
}

// Today, tomorrow, and the day after - kept inside the week's bounds. When
// today is already past the last three days of the week (Sat, Sun), or this
// plan is a week that's already over, the last three days of the week are
// what you get. A week that hasn't started yet opens on its first three.
export function timePlanThreeDayCalendarDates(
  today: ADate,
  periodStartDate: ADate,
  periodEndDate: ADate,
): ADate[] {
  const todayDate = aDateToDate(today);
  const periodStart = aDateToDate(periodStartDate);
  const periodEnd = aDateToDate(periodEndDate);
  const lastWindowStart = periodEnd.minus({
    days: TIME_PLAN_THREE_DAY_CALENDAR_DAYS - 1,
  });

  let windowStart = todayDate;
  if (todayDate < periodStart) {
    windowStart = periodStart;
  } else if (todayDate > lastWindowStart) {
    windowStart = lastWindowStart < periodStart ? periodStart : lastWindowStart;
  }

  const windowEndCandidate = windowStart.plus({
    days: TIME_PLAN_THREE_DAY_CALENDAR_DAYS - 1,
  });
  const windowEnd =
    windowEndCandidate <= periodEnd ? windowEndCandidate : periodEnd;

  return allDaysBetween(dateToAdate(windowStart), dateToAdate(windowEnd));
}

// Which view a time plan is being looked at with: whatever the URL asks for,
// as long as this plan can show it, and the one that suits the plan when it
// doesn't say - or asks for something that's not on offer here.
export function resolveTimePlanViewMode(
  raw: string | null | undefined,
  workspace: Workspace,
  timePlan: TimePlan,
): TimePlanViewMode {
  const asked = parseTimePlanViewMode(raw);
  if (
    asked !== undefined &&
    timePlanViewModeIsAllowed(asked, workspace, timePlan)
  ) {
    return asked;
  }

  return defaultTimePlanViewMode(workspace, timePlan);
}

export function defaultTimePlanViewMode(
  workspace: Workspace,
  timePlan: TimePlan,
): TimePlanViewMode {
  if (!isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)) {
    return TimePlanViewMode.LIST;
  }

  switch (timePlan.period) {
    case RecurringTaskPeriod.DAILY:
    case RecurringTaskPeriod.WEEKLY:
    case RecurringTaskPeriod.MONTHLY:
      return TimePlanViewMode.LIST;
    case RecurringTaskPeriod.QUARTERLY:
    case RecurringTaskPeriod.YEARLY:
      return TimePlanViewMode.TIMELINE;
  }
}

// Tacks the view and grouping onto a link, so that wherever it leads comes
// back to the time plan as it's being looked at right now. A query object
// copies both; a view string can take grouping alongside it.
export function withTimePlanView(
  path: string,
  viewOrQuery: string | null | undefined | URLSearchParams,
  grouping?: string | null | undefined,
): string {
  if (viewOrQuery instanceof URLSearchParams) {
    return withTimePlanDisplay(path, viewOrQuery);
  }

  return appendTimePlanQueryParam(
    appendTimePlanQueryParam(path, TIME_PLAN_VIEW_PARAM, viewOrQuery),
    TIME_PLAN_GROUPING_PARAM,
    grouping,
  );
}

// The view and grouping a link came in with, copied onto another path so
// they survive a round trip through a panel.
export function withTimePlanDisplay(
  path: string,
  query: URLSearchParams,
): string {
  return withTimePlanView(
    path,
    query.get(TIME_PLAN_VIEW_PARAM),
    query.get(TIME_PLAN_GROUPING_PARAM),
  );
}

// The view a link came in with, for passing it along further.
export function timePlanViewFromQuery(
  query: URLSearchParams,
): string | undefined {
  return query.get(TIME_PLAN_VIEW_PARAM) ?? undefined;
}

function appendTimePlanQueryParam(
  path: string,
  key: string,
  value: string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}

// Adding a time event on a time plan opens a leaf on this same plan. The
// calendar of the period is what you add against, so that leaf is how we
// know to show it - even if the URL is still carrying another view to
// restore when the adding is done.
export function timePlanPathIsAddingTimeEvent(pathname: string): boolean {
  return (
    pathname.endsWith("/new-schedule-event-in-day") ||
    pathname.endsWith("/new-activity-time-event")
  );
}
