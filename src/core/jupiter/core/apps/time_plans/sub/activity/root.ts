import {
  BigPlan,
  BigPlanStatus,
  Chore,
  Habit,
  InboxTask,
  InboxTaskStatus,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityEntry,
  TimePlanActivityFeasability,
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
import { compareTimePlanActivityFeasability } from "#/core/apps/time_plans/sub/activity/feasability";
import { compareTimePlanActivityKind } from "#/core/apps/time_plans/sub/activity/kind";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
  timePlanActivityTargetSortOrder,
} from "#/core/apps/time_plans/sub/activity/target-wire";

export function timePlanActivityTargetNameForEvent(
  targetInboxTask?: InboxTask | null,
  targetBigPlan?: BigPlan | null,
  activityRefId?: string,
  targetTodoTask?: TodoTask | null,
  targetHabit?: Habit | null,
  targetChore?: Chore | null,
): string {
  if (targetInboxTask) {
    const name = targetInboxTask.name;
    if (targetInboxTask.status === InboxTaskStatus.DONE) {
      return `✅ ${name}`;
    }
    if (targetInboxTask.status === InboxTaskStatus.NOT_DONE) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  if (targetTodoTask) {
    const name = targetTodoTask.name;
    if (targetTodoTask.archived) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  if (targetBigPlan) {
    const name = targetBigPlan.name;
    if (targetBigPlan.status === BigPlanStatus.DONE) {
      return `✅ ${name}`;
    }
    if (targetBigPlan.status === BigPlanStatus.NOT_DONE) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  if (targetHabit) {
    const name = targetHabit.name;
    if (targetHabit.archived) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  if (targetChore) {
    const name = targetChore.name;
    if (targetChore.archived) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  return `📋 Work on activity ${activityRefId ?? "unknown"}`;
}

export function timePlanActivityNameForEvent(
  entry: TimePlanActivityEntry,
): string {
  return timePlanActivityTargetNameForEvent(
    entry.target_inbox_task,
    entry.target_big_plan,
    entry.time_plan_activity.ref_id,
    entry.target_todo_task,
    entry.target_habit,
    entry.target_chore,
  );
}

export function filterActivityByFeasabilityWithParents(
  timePlanActivities: TimePlanActivity[],
  parentActivitiesByRefId: Map<string, TimePlanActivity>,
  targetInboxTasks: Map<string, InboxTask>,
  feasability: TimePlanActivityFeasability,
): TimePlanActivity[] {
  return timePlanActivities.filter((a) => {
    if (
      isTimePlanActivityBigPlanTarget(a.target) ||
      isTimePlanActivityTodoTaskTarget(a.target) ||
      isTimePlanActivityHabitTarget(a.target) ||
      isTimePlanActivityChoreTarget(a.target)
    ) {
      return a.feasability === feasability;
    }
    const inboxTask = targetInboxTasks.get(entityLinkRefIdFromWire(a.target));
    if (!inboxTask) {
      return a.feasability === feasability;
    }
    const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(
      inboxTask.owner,
    );
    if (
      ownerNamespace !== BIG_PLAN &&
      ownerNamespace !== HABIT &&
      ownerNamespace !== CHORE
    ) {
      return a.feasability === feasability;
    }

    const parentActivity = parentActivitiesByRefId.get(inboxTask.owner);
    if (!parentActivity) {
      return a.feasability === feasability;
    }

    return parentActivity.feasability === feasability;
  });
}

export function filterActivitiesByTargetStatus(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
  targetBigPlans: Map<string, BigPlan>,
  activityDoneness: Record<string, TimePlanActivityDoneness>,
  targetTodoTasks?: Map<string, TodoTask>,
  targetHabits?: Map<string, Habit>,
  targetChores?: Map<string, Chore>,
): TimePlanActivity[] {
  return timePlanActivities.filter((activity) => {
    if (activityDoneness[activity.ref_id] === TimePlanActivityDoneness.DONE) {
      return false;
    }

    if (isTimePlanActivityInboxTaskTarget(activity.target)) {
      const inboxTask = targetInboxTasks.get(
        entityLinkRefIdFromWire(activity.target),
      );
      return inboxTask ? !inboxTask.archived : true;
    }
    if (isTimePlanActivityTodoTaskTarget(activity.target)) {
      const todoTask = targetTodoTasks?.get(
        entityLinkRefIdFromWire(activity.target),
      );
      if (todoTask) {
        return !todoTask.archived;
      }
      const ownedInboxTask = [...targetInboxTasks.values()].find(
        (inboxTask) =>
          parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) ===
            TODO_TASK &&
          entityLinkRefIdFromWire(inboxTask.owner) ===
            entityLinkRefIdFromWire(activity.target),
      );
      return ownedInboxTask ? !ownedInboxTask.archived : true;
    }
    if (isTimePlanActivityHabitTarget(activity.target)) {
      const habit = targetHabits?.get(entityLinkRefIdFromWire(activity.target));
      if (habit) {
        return !habit.archived && !habit.suspended;
      }
      const ownedInboxTask = [...targetInboxTasks.values()].find(
        (inboxTask) =>
          parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === HABIT &&
          entityLinkRefIdFromWire(inboxTask.owner) ===
            entityLinkRefIdFromWire(activity.target),
      );
      return ownedInboxTask ? !ownedInboxTask.archived : true;
    }
    if (isTimePlanActivityChoreTarget(activity.target)) {
      const chore = targetChores?.get(entityLinkRefIdFromWire(activity.target));
      if (chore) {
        return !chore.archived && !chore.suspended;
      }
      const ownedInboxTask = [...targetInboxTasks.values()].find(
        (inboxTask) =>
          parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === CHORE &&
          entityLinkRefIdFromWire(inboxTask.owner) ===
            entityLinkRefIdFromWire(activity.target),
      );
      return ownedInboxTask ? !ownedInboxTask.archived : true;
    }
    if (isTimePlanActivityBigPlanTarget(activity.target)) {
      const bigPlan = targetBigPlans.get(
        entityLinkRefIdFromWire(activity.target),
      );
      return bigPlan ? !bigPlan.archived : true;
    }

    throw new Error("This should not happen");
  });
}

function parentGroupingLink(
  activity: TimePlanActivity,
  targetInboxTasks: Map<string, InboxTask>,
): string | undefined {
  if (
    isTimePlanActivityBigPlanTarget(activity.target) ||
    isTimePlanActivityTodoTaskTarget(activity.target) ||
    isTimePlanActivityHabitTarget(activity.target) ||
    isTimePlanActivityChoreTarget(activity.target)
  ) {
    return activity.target;
  }

  if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
    return undefined;
  }

  const inboxTask = targetInboxTasks.get(
    entityLinkRefIdFromWire(activity.target),
  );
  if (!inboxTask) {
    return undefined;
  }

  const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(inboxTask.owner);
  if (
    ownerNamespace !== BIG_PLAN &&
    ownerNamespace !== HABIT &&
    ownerNamespace !== CHORE
  ) {
    return undefined;
  }

  return inboxTask.owner;
}

export function sortTimePlanActivitiesNaturally(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
): TimePlanActivity[] {
  return [...timePlanActivities].sort((j1, j2) => {
    const j1Parent = parentGroupingLink(j1, targetInboxTasks);
    const j2Parent = parentGroupingLink(j2, targetInboxTasks);

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
