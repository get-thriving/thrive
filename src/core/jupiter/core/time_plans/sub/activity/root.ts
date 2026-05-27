import {
  BigPlan,
  InboxTask,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
} from "@jupiter/webapi-client";

import {
  BIG_PLAN,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { compareTimePlanActivityFeasability } from "#/core/time_plans/sub/activity/feasability";
import { compareTimePlanActivityKind } from "#/core/time_plans/sub/activity/kind";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityInboxTaskTarget,
  timePlanActivityTargetSortOrder,
} from "#/core/time_plans/sub/activity/target-wire";

export function filterActivityByFeasabilityWithParents(
  timePlanActivities: TimePlanActivity[],
  activitiesByBigPlanRefId: Map<string, TimePlanActivity>,
  targetInboxTasks: Map<string, InboxTask>,
  targetBigPlans: Map<string, BigPlan>,
  feasability: TimePlanActivityFeasability,
): TimePlanActivity[] {
  return timePlanActivities.filter((a) => {
    if (isTimePlanActivityBigPlanTarget(a.target)) {
      return a.feasability === feasability;
    }
    const inboxTask = targetInboxTasks.get(entityLinkRefIdFromWire(a.target))!;
    if (parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) !== BIG_PLAN) {
      return a.feasability === feasability;
    }

    const bigPlan = targetBigPlans.get(
      entityLinkRefIdFromWire(inboxTask.owner),
    )!;
    const bigPlanActivity = activitiesByBigPlanRefId.get(bigPlan.ref_id)!;

    return bigPlanActivity.feasability === feasability;
  });
}

export function filterActivitiesByTargetStatus(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
  targetBigPlans: Map<string, BigPlan>,
  activityDoneness: Record<string, TimePlanActivityDoneness>,
): TimePlanActivity[] {
  return timePlanActivities.filter((activity) => {
    if (activityDoneness[activity.ref_id] === TimePlanActivityDoneness.DONE) {
      return false;
    }

    if (isTimePlanActivityInboxTaskTarget(activity.target)) {
      const inboxTask = targetInboxTasks.get(
        entityLinkRefIdFromWire(activity.target),
      )!;
      return !inboxTask.archived;
    }
    if (isTimePlanActivityBigPlanTarget(activity.target)) {
      const bigPlan = targetBigPlans.get(
        entityLinkRefIdFromWire(activity.target),
      )!;
      return !bigPlan.archived;
    }

    throw new Error("This should not happen");
  });
}

export function sortTimePlanActivitiesNaturally(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
): TimePlanActivity[] {
  return [...timePlanActivities].sort((j1, j2) => {
    const j1Parent = isTimePlanActivityBigPlanTarget(j1.target)
      ? entityLinkRefIdFromWire(j1.target)
      : parentLinkNamespaceFromEntityLinkWire(
            targetInboxTasks.get(entityLinkRefIdFromWire(j1.target))!.owner,
          ) === BIG_PLAN
        ? entityLinkRefIdFromWire(
            targetInboxTasks.get(entityLinkRefIdFromWire(j1.target))!.owner,
          )
        : undefined;
    const j2Parent = isTimePlanActivityBigPlanTarget(j2.target)
      ? entityLinkRefIdFromWire(j2.target)
      : parentLinkNamespaceFromEntityLinkWire(
            targetInboxTasks.get(entityLinkRefIdFromWire(j2.target))!.owner,
          ) === BIG_PLAN
        ? entityLinkRefIdFromWire(
            targetInboxTasks.get(entityLinkRefIdFromWire(j2.target))!.owner,
          )
        : undefined;

    if (j1Parent !== j2Parent) {
      if (j1Parent === undefined || j1Parent === null) {
        return 1;
      }
      if (j2Parent === undefined || j2Parent === null) {
        return -1;
      }

      return j1Parent.localeCompare(j2Parent);
    }

    if (j1.target !== j2.target) {
      return (
        timePlanActivityTargetSortOrder(j1.target) -
        timePlanActivityTargetSortOrder(j2.target)
      );
    }

    if (j2.archived && !j1.archived) {
      return -1;
    }

    if (j1.archived && !j2.archived) {
      return 1;
    }

    return (
      compareTimePlanActivityFeasability(j1.feasability, j2.feasability) ||
      compareTimePlanActivityKind(j1.kind, j2.kind)
    );
  });
}
