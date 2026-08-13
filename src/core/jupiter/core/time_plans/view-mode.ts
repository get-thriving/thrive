import type { TimePlan, Workspace } from "@jupiter/webapi-client";
import { RecurringTaskPeriod, WorkspaceFeature } from "@jupiter/webapi-client";

import {
  timePlanAllowsCalendarView,
  timePlanAllowsKanbanViews,
} from "#/core/time_plans/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

// The ways of looking at the activities of a time plan.
export enum TimePlanViewMode {
  KANBAN_BY_EISEN = "kanban-by-eisen",
  KANBAN = "kanban",
  LIST = "list",
  TIMELINE = "timeline",
  CALENDAR = "calendar",
}

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
    case TimePlanViewMode.LIST:
    case TimePlanViewMode.TIMELINE:
      return true;
  }
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

// Tacks the view onto a link, so that wherever it leads comes back to the
// time plan as it's being looked at right now.
export function withTimePlanView(
  path: string,
  view: string | null | undefined,
): string {
  if (view === null || view === undefined || view === "") {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${TIME_PLAN_VIEW_PARAM}=${encodeURIComponent(view)}`;
}

// The view a link came in with, for passing it along further.
export function timePlanViewFromQuery(
  query: URLSearchParams,
): string | undefined {
  return query.get(TIME_PLAN_VIEW_PARAM) ?? undefined;
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
