import type {
  AspectSummary,
  Project,
  Chore,
  EntityId,
  Habit,
  InboxTask,
  TimePlanActivity,
  TodoTask,
} from "@jupiter/webapi-client";

import {
  PROJECT,
  CHORE,
  entityLinkRefIdFromWire,
  HABIT,
  parentLinkNamespaceFromEntityLinkWire,
  TODO_TASK,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  isTimePlanActivityProjectTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";

/** The entities an activity can be grouped under - they carry the aspect and goal. */
export interface TimePlanActivityGroupingMaps {
  targetInboxTasksByRefId: Map<string, InboxTask>;
  targetProjectsByRefId: Map<string, Project>;
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
 * Activities aimed at a project, a habit, a chore or a todo task are the
 * parents of the activities aimed at the inbox tasks these entities own. The
 * index is keyed by the full target entity link, not just the ref id, because
 * habits, chores, projects and todo tasks have independent id sequences.
 */
export function parentActivitiesByTargetRefId(
  activities: TimePlanActivity[],
): Map<string, TimePlanActivity> {
  const parentActivities = new Map<string, TimePlanActivity>();

  for (const activity of activities) {
    if (
      !isTimePlanActivityProjectTarget(activity.target) &&
      !isTimePlanActivityHabitTarget(activity.target) &&
      !isTimePlanActivityChoreTarget(activity.target) &&
      !isTimePlanActivityTodoTaskTarget(activity.target)
    ) {
      continue;
    }

    parentActivities.set(activity.target, activity);
  }

  return parentActivities;
}

/** Keep just the activities whose target belongs to a certain aspect. */
export function filterActivitiesForAspect(
  activities: TimePlanActivity[],
  aspect: AspectSummary,
  maps: TimePlanActivityGroupingMaps,
): TimePlanActivity[] {
  return filterActivitiesForAspects(activities, [aspect.ref_id], maps);
}

/** Keep just the activities whose target belongs to one of the given aspects. */
export function filterActivitiesForAspects(
  activities: TimePlanActivity[],
  aspectRefIds: EntityId[],
  maps: TimePlanActivityGroupingMaps,
): TimePlanActivity[] {
  if (aspectRefIds.length === 0) {
    return activities;
  }

  const allowed = new Set(aspectRefIds);
  return activities.filter((activity) => {
    const parent = parentForActivity(activity, maps);
    return parent !== null && allowed.has(parent.aspectRefId);
  });
}

/** The goal an activity works towards, via its target, if there is one. */
export function goalRefIdForActivity(
  activity: TimePlanActivity,
  targetInboxTasksByRefId: Map<string, InboxTask>,
  targetProjectsByRefId: Map<string, Project>,
  targetTodoTasksByRefId: Map<string, TodoTask>,
  targetHabitsByRefId: Map<string, Habit>,
  targetChoresByRefId: Map<string, Chore>,
): EntityId | null {
  const parent = parentForActivity(activity, {
    targetInboxTasksByRefId,
    targetProjectsByRefId,
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

  if (isTimePlanActivityProjectTarget(activity.target)) {
    return parentForEntity(maps.targetProjectsByRefId.get(targetRefId));
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
    case PROJECT:
      return parentForEntity(maps.targetProjectsByRefId.get(ownerRefId));
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
  entity: Project | Chore | Habit | TodoTask | undefined,
): ActivityParent | null {
  if (!entity) {
    return null;
  }
  return {
    aspectRefId: entity.aspect_ref_id,
    goalRefId: entity.goal_ref_id,
  };
}
