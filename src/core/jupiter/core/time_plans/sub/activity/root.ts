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
import { compareTimePlanActivityFeasability } from "#/core/time_plans/sub/activity/feasability";
import { compareTimePlanActivityKind } from "#/core/time_plans/sub/activity/kind";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityTodoTaskTarget,
  timePlanActivityTargetSortOrder,
} from "#/core/time_plans/sub/activity/target-wire";

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

    const parentActivity = parentActivitiesByRefId.get(
      entityLinkRefIdFromWire(inboxTask.owner),
    );
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

export function sortTimePlanActivitiesNaturally(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
): TimePlanActivity[] {
  return [...timePlanActivities].sort((j1, j2) => {
    const j1InboxTask = isTimePlanActivityInboxTaskTarget(j1.target)
      ? targetInboxTasks.get(entityLinkRefIdFromWire(j1.target))
      : undefined;
    const j1Parent = isTimePlanActivityBigPlanTarget(j1.target)
      ? entityLinkRefIdFromWire(j1.target)
      : isTimePlanActivityTodoTaskTarget(j1.target)
        ? entityLinkRefIdFromWire(j1.target)
        : isTimePlanActivityHabitTarget(j1.target)
          ? entityLinkRefIdFromWire(j1.target)
          : isTimePlanActivityChoreTarget(j1.target)
            ? entityLinkRefIdFromWire(j1.target)
            : j1InboxTask &&
                parentLinkNamespaceFromEntityLinkWire(j1InboxTask.owner) ===
                  BIG_PLAN
              ? entityLinkRefIdFromWire(j1InboxTask.owner)
              : j1InboxTask &&
                  parentLinkNamespaceFromEntityLinkWire(j1InboxTask.owner) ===
                    HABIT
                ? entityLinkRefIdFromWire(j1InboxTask.owner)
                : j1InboxTask &&
                    parentLinkNamespaceFromEntityLinkWire(j1InboxTask.owner) ===
                      CHORE
                  ? entityLinkRefIdFromWire(j1InboxTask.owner)
                  : undefined;
    const j2InboxTask = isTimePlanActivityInboxTaskTarget(j2.target)
      ? targetInboxTasks.get(entityLinkRefIdFromWire(j2.target))
      : undefined;
    const j2Parent = isTimePlanActivityBigPlanTarget(j2.target)
      ? entityLinkRefIdFromWire(j2.target)
      : isTimePlanActivityTodoTaskTarget(j2.target)
        ? entityLinkRefIdFromWire(j2.target)
        : isTimePlanActivityHabitTarget(j2.target)
          ? entityLinkRefIdFromWire(j2.target)
          : isTimePlanActivityChoreTarget(j2.target)
            ? entityLinkRefIdFromWire(j2.target)
            : j2InboxTask &&
                parentLinkNamespaceFromEntityLinkWire(j2InboxTask.owner) ===
                  BIG_PLAN
              ? entityLinkRefIdFromWire(j2InboxTask.owner)
              : j2InboxTask &&
                  parentLinkNamespaceFromEntityLinkWire(j2InboxTask.owner) ===
                    HABIT
                ? entityLinkRefIdFromWire(j2InboxTask.owner)
                : j2InboxTask &&
                    parentLinkNamespaceFromEntityLinkWire(j2InboxTask.owner) ===
                      CHORE
                  ? entityLinkRefIdFromWire(j2InboxTask.owner)
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
