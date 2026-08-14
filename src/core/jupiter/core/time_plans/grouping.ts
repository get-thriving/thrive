import type { TimePlan, Workspace } from "@jupiter/webapi-client";
import { RecurringTaskPeriod, WorkspaceFeature } from "@jupiter/webapi-client";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

// How the activities of a time plan are grouped: all together, by aspect,
// or by aspect and then by goal.
export enum TimePlanGrouping {
  MERGED = "merged",
  BY_ASPECT = "by-aspect",
  BY_ASPECT_AND_GOALS = "by-aspect-and-goals",
}

// The grouping rides along in the URL, so a reload - or coming back from one
// of the panels a time plan opens - lands on the same one.
export const TIME_PLAN_GROUPING_PARAM = "timePlanGrouping";

export function parseTimePlanGrouping(
  raw: string | null | undefined,
): TimePlanGrouping | undefined {
  for (const grouping of Object.values(TimePlanGrouping)) {
    if (grouping === raw) {
      return grouping;
    }
  }

  return undefined;
}

export function timePlanGroupingIsAllowed(
  grouping: TimePlanGrouping,
  workspace: Workspace,
): boolean {
  switch (grouping) {
    case TimePlanGrouping.MERGED:
      return true;
    case TimePlanGrouping.BY_ASPECT:
    case TimePlanGrouping.BY_ASPECT_AND_GOALS:
      return isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN);
  }
}

// Which grouping a time plan is being looked at with: whatever the URL asks
// for, as long as this workspace can show it, and the one that suits the
// plan when it doesn't say - or asks for something that's not on offer here.
export function resolveTimePlanGrouping(
  raw: string | null | undefined,
  workspace: Workspace,
  timePlan: TimePlan,
): TimePlanGrouping {
  const asked = parseTimePlanGrouping(raw);
  if (asked !== undefined && timePlanGroupingIsAllowed(asked, workspace)) {
    return asked;
  }

  return defaultTimePlanGrouping(workspace, timePlan);
}

export function defaultTimePlanGrouping(
  workspace: Workspace,
  timePlan: TimePlan,
): TimePlanGrouping {
  if (!isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.LIFE_PLAN)) {
    return TimePlanGrouping.MERGED;
  }

  switch (timePlan.period) {
    case RecurringTaskPeriod.DAILY:
    case RecurringTaskPeriod.WEEKLY:
      return TimePlanGrouping.MERGED;
    case RecurringTaskPeriod.MONTHLY:
      return TimePlanGrouping.BY_ASPECT;
    case RecurringTaskPeriod.QUARTERLY:
    case RecurringTaskPeriod.YEARLY:
      return TimePlanGrouping.BY_ASPECT_AND_GOALS;
  }
}
