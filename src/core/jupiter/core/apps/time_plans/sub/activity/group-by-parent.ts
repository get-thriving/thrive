import type {
  AspectSummary,
  BigPlan,
  Chore,
  EntityId,
  Habit,
  InboxTask,
  TimePlanActivity,
  TodoTask,
} from "@jupiter/webapi-client";

import {
  BIG_PLAN,
  CHORE,
  entityLinkRefIdFromWire,
  HABIT,
  parentLinkNamespaceFromEntityLinkWire,
  TODO_TASK,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";

/** The entities an activity can be grouped under - they carry the aspect and goal. */
export interface TimePlanActivityGroupingMaps {
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetBigPlansByRefId: Map<string, BigPlan>;
  targetTodoTasksByRefId: Map<string, TodoTask>;
  targetHabitsByRefId: Map<string, Habit>;
  targetChoresByRefId: Map<string, Chore>;
}

interface ActivityParent {
  aspectRefId: EntityId;
  goalRefId?: EntityId | null;
}

/**
 * Index the activities which can act as a parent for other activities.
 *
 * Activities aimed at a big plan, a habit, a chore or a todo task are the
 * parents of the activities aimed at the inbox tasks these entities own. The
 * index is keyed by the ref id of the target, since that is what an inbox
 * task's owner link carries.
 */
export function parentActivitiesByTargetRefId(
  activities: TimePlanActivity[],
): Map<string, TimePlanActivity> {
  const parentActivities = new Map<string, TimePlanActivity>();

  for (const activity of activities) {
    if (
      !isTimePlanActivityBigPlanTarget(activity.target) &&
      !isTimePlanActivityHabitTarget(activity.target) &&
      !isTimePlanActivityChoreTarget(activity.target) &&
      !isTimePlanActivityTodoTaskTarget(activity.target)
    ) {
      continue;
    }

    parentActivities.set(entityLinkRefIdFromWire(activity.target), activity);
  }

  return parentActivities;
}

/** Keep just the activities whose target belongs to a certain aspect. */
export function filterActivitiesForAspect(
  activities: TimePlanActivity[],
  aspect: AspectSummary,
  maps: TimePlanActivityGroupingMaps,
): TimePlanActivity[] {
  return activities.filter((activity) => {
    const parent = parentForActivity(activity, maps);
    if (!parent) {
      return false;
    }
    return parent.aspectRefId === aspect.ref_id;
  });
}

/** The goal an activity works towards, via its target, if there is one. */
export function goalRefIdForActivity(
  activity: TimePlanActivity,
  targetInboxTasksByRefId: Map<string, InboxTask>,
  targetBigPlansByRefId: Map<string, BigPlan>,
  targetTodoTasksByRefId: Map<string, TodoTask>,
  targetHabitsByRefId: Map<string, Habit>,
  targetChoresByRefId: Map<string, Chore>,
): EntityId | null {
  const parent = parentForActivity(activity, {
    targetInboxTasksByRefId,
    targetBigPlansByRefId,
    targetTodoTasksByRefId,
    targetHabitsByRefId,
    targetChoresByRefId,
  });
  if (!parent) {
    return null;
  }
  return parent.goalRefId ?? null;
}

function parentForActivity(
  activity: TimePlanActivity,
  maps: TimePlanActivityGroupingMaps,
): ActivityParent | null {
  const targetRefId = entityLinkRefIdFromWire(activity.target);

  if (isTimePlanActivityBigPlanTarget(activity.target)) {
    return parentForEntity(maps.targetBigPlansByRefId.get(targetRefId));
  }
  if (isTimePlanActivityTodoTaskTarget(activity.target)) {
    return parentForEntity(maps.targetTodoTasksByRefId.get(targetRefId));
  }
  if (isTimePlanActivityHabitTarget(activity.target)) {
    return parentForEntity(maps.targetHabitsByRefId.get(targetRefId));
  }
  if (isTimePlanActivityChoreTarget(activity.target)) {
    return parentForEntity(maps.targetChoresByRefId.get(targetRefId));
  }
  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return null;
  }

  // An inbox task does not carry an aspect or goal itself, so we look at the
  // entity which generated it.
  const inboxTask = maps.targetInboxTasksByRefId.get(targetRefId);
  if (!inboxTask) {
    return null;
  }

  const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
  const ownerRefId = entityLinkRefIdFromWire(inboxTask.owner);

  switch (ownerNamespace) {
    case BIG_PLAN:
      return parentForEntity(maps.targetBigPlansByRefId.get(ownerRefId));
    case TODO_TASK:
      return parentForEntity(maps.targetTodoTasksByRefId.get(ownerRefId));
    case HABIT:
      return parentForEntity(maps.targetHabitsByRefId.get(ownerRefId));
    case CHORE:
      return parentForEntity(maps.targetChoresByRefId.get(ownerRefId));
    default:
      return null;
  }
}

function parentForEntity(
  entity: BigPlan | Chore | Habit | TodoTask | undefined,
): ActivityParent | null {
  if (!entity) {
    return null;
  }
  return {
    aspectRefId: entity.aspect_ref_id,
    goalRefId: entity.goal_ref_id,
  };
}
