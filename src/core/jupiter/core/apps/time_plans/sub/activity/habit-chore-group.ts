import type {
  InboxTask,
  TimeEventInDayBlock,
  TimePlanActivity,
} from "@jupiter/webapi-client";
import { InboxTaskStatus } from "@jupiter/webapi-client";

import { compareADate } from "#/core/common/adate";
import {
  CHORE,
  entityLinkRefIdFromWire,
  HABIT,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { isCompleted } from "#/core/common/sub/inbox_tasks/status";
import { isTimePlanActivityInboxTaskTarget } from "#/core/apps/time_plans/sub/activity/target-wire";

export interface HabitChoreInboxTaskStats {
  notStartedCount: number;
  doneCount: number;
  notDoneCount: number;
}

/**
 * Inbox-task activities that sit under a habit or chore already on this plan.
 * Keyed by the parent's target entity link (`Habit:std:…` / `Chore:std:…`).
 */
export function habitAndChoreChildActivitiesByParentTarget(
  activities: TimePlanActivity[],
  inboxTasksByRefId: Map<string, InboxTask>,
  parentActivitiesByTarget: Map<string, TimePlanActivity>,
): Map<string, TimePlanActivity[]> {
  const childrenByParent = new Map<string, TimePlanActivity[]>();

  for (const activity of activities) {
    const parentTarget = habitOrChoreParentTargetForInboxTaskActivity(
      activity,
      inboxTasksByRefId,
    );
    if (parentTarget === undefined) {
      continue;
    }
    if (!parentActivitiesByTarget.has(parentTarget)) {
      continue;
    }

    const existing = childrenByParent.get(parentTarget) ?? [];
    existing.push(activity);
    childrenByParent.set(parentTarget, existing);
  }

  for (const [parentTarget, children] of childrenByParent) {
    childrenByParent.set(
      parentTarget,
      sortHabitOrChoreChildActivities(children, inboxTasksByRefId),
    );
  }

  return childrenByParent;
}

export function habitOrChoreParentTargetForInboxTaskActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
): string | undefined {
  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return undefined;
  }

  const inboxTask = inboxTasksByRefId.get(
    entityLinkRefIdFromWire(activity.target),
  );
  if (!inboxTask) {
    return undefined;
  }

  const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
  if (ownerNamespace !== HABIT && ownerNamespace !== CHORE) {
    return undefined;
  }

  return inboxTask.owner;
}

export function habitChoreInboxTaskStats(
  activities: TimePlanActivity[],
  inboxTasksByRefId: Map<string, InboxTask>,
): HabitChoreInboxTaskStats {
  const stats: HabitChoreInboxTaskStats = {
    notStartedCount: 0,
    doneCount: 0,
    notDoneCount: 0,
  };

  for (const activity of activities) {
    if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
      continue;
    }
    const inboxTask = inboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    );
    switch (inboxTask?.status) {
      case InboxTaskStatus.DONE:
        stats.doneCount += 1;
        break;
      case InboxTaskStatus.NOT_DONE:
        stats.notDoneCount += 1;
        break;
      default:
        stats.notStartedCount += 1;
        break;
    }
  }

  return stats;
}

/**
 * Which inbox-task activity a drag from the habit/chore should create a time
 * event on: the earliest not-finished one with the fewest time events, so
 * repeated drops fill one task, then the next, until they all have one, and
 * then another round. If every associated task is already finished, the one
 * with the fewest time events still gets the drop.
 */
export function selectHabitOrChorePlaceActivity(
  activities: TimePlanActivity[],
  inboxTasksByRefId: Map<string, InboxTask>,
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>,
): TimePlanActivity | undefined {
  const placeable = activities.filter((activity) => !activity.archived);
  if (placeable.length === 0) {
    return undefined;
  }

  const notFinished = placeable.filter(
    (activity) => !inboxTaskActivityIsFinished(activity, inboxTasksByRefId),
  );
  const pool = notFinished.length > 0 ? notFinished : placeable;

  return [...pool].sort((left, right) =>
    compareHabitOrChorePlaceActivities(
      left,
      right,
      inboxTasksByRefId,
      timeEventsByRefId,
    ),
  )[0];
}

export function timeEventCountForTimePlanActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>,
): number {
  const activityEvents = timeEventsByRefId.get(`tpa:${activity.ref_id}`) ?? [];
  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return activityEvents.length;
  }

  const inboxTask = inboxTasksByRefId.get(
    entityLinkRefIdFromWire(activity.target),
  );
  const inboxEvents = inboxTask
    ? (timeEventsByRefId.get(`it:${inboxTask.ref_id}`) ?? [])
    : [];
  return activityEvents.length + inboxEvents.length;
}

function inboxTaskActivityIsFinished(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
): boolean {
  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return false;
  }
  const inboxTask = inboxTasksByRefId.get(
    entityLinkRefIdFromWire(activity.target),
  );
  if (!inboxTask) {
    return false;
  }
  return isCompleted(inboxTask.status);
}

function sortHabitOrChoreChildActivities(
  activities: TimePlanActivity[],
  inboxTasksByRefId: Map<string, InboxTask>,
): TimePlanActivity[] {
  return [...activities].sort((left, right) =>
    compareInboxTaskActivityEarliness(left, right, inboxTasksByRefId),
  );
}

function compareHabitOrChorePlaceActivities(
  left: TimePlanActivity,
  right: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  timeEventsByRefId: Map<string, TimeEventInDayBlock[]>,
): number {
  const eventsDiff =
    timeEventCountForTimePlanActivity(
      left,
      inboxTasksByRefId,
      timeEventsByRefId,
    ) -
    timeEventCountForTimePlanActivity(
      right,
      inboxTasksByRefId,
      timeEventsByRefId,
    );
  if (eventsDiff !== 0) {
    return eventsDiff;
  }

  return compareInboxTaskActivityEarliness(left, right, inboxTasksByRefId);
}

function compareInboxTaskActivityEarliness(
  left: TimePlanActivity,
  right: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
): number {
  const leftInboxTask = inboxTaskForActivity(left, inboxTasksByRefId);
  const rightInboxTask = inboxTaskForActivity(right, inboxTasksByRefId);

  return (
    compareADate(leftInboxTask?.due_date, rightInboxTask?.due_date) ||
    compareADate(
      leftInboxTask?.actionable_date,
      rightInboxTask?.actionable_date,
    ) ||
    left.ref_id.localeCompare(right.ref_id)
  );
}

function inboxTaskForActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
): InboxTask | undefined {
  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return undefined;
  }
  return inboxTasksByRefId.get(entityLinkRefIdFromWire(activity.target));
}
