import type { SchedulingParams } from "@jupiter/webapi-client";
import {
  BigPlan,
  BigPlanStatus,
  Chore,
  ChoreStack,
  Difficulty,
  Habit,
  HabitStack,
  InboxTask,
  InboxTaskStatus,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityEntry,
  TimePlanActivityFeasability,
  TimePlanActivityKind,
  TodoTask,
} from "@jupiter/webapi-client";

import { inferDurationMinsFromDifficulty } from "#/core/common/difficulty";
import {
  isSchedulable,
  schedulingEventDurationMins,
  schedulingTotalDurationMins,
} from "#/core/common/scheduling-params";
import {
  BIG_PLAN,
  CHORE,
  entityLinkRefIdFromWire,
  HABIT,
  parentLinkNamespaceFromEntityLinkWire,
  TODO_TASK,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { inferDurationMinsFromInboxTask } from "#/core/common/sub/inbox_tasks/root";
import { compareTimePlanActivityFeasability } from "#/core/apps/time_plans/sub/activity/feasability";
import { compareTimePlanActivityKind } from "#/core/apps/time_plans/sub/activity/kind";
import {
  isTimePlanActivityBigPlanTarget,
  isTimePlanActivityChoreStackTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityHabitStackTarget,
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
  targetHabitStack?: HabitStack | null,
  targetChoreStack?: ChoreStack | null,
): string {
  if (targetInboxTask) {
    const name = targetInboxTask.name;
    if (targetInboxTask.status === InboxTaskStatus.DONE) {
      return `✅ ${name}`;
    }
    if (targetInboxTask.status === InboxTaskStatus.NOT_DONE) {
      return `❌ ${name}`;
    }
    if (targetInboxTask.status === InboxTaskStatus.IN_PROGRESS) {
      return `🚧 ${name}`;
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
    if (targetBigPlan.status === BigPlanStatus.IN_PROGRESS) {
      return `🚧 ${name}`;
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
  if (targetHabitStack) {
    const name = targetHabitStack.name;
    if (targetHabitStack.archived) {
      return `❌ ${name}`;
    }
    return `${name}`;
  }
  if (targetChoreStack) {
    const name = targetChoreStack.name;
    if (targetChoreStack.archived) {
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
    entry.target_habit_stack,
    entry.target_chore_stack,
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
      isTimePlanActivityHabitStackTarget(a.target) ||
      isTimePlanActivityHabitTarget(a.target) ||
      isTimePlanActivityChoreStackTarget(a.target) ||
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
  targetHabitStacks?: Map<string, HabitStack>,
  targetChoreStacks?: Map<string, ChoreStack>,
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
    if (isTimePlanActivityHabitStackTarget(activity.target)) {
      const stack = targetHabitStacks?.get(
        entityLinkRefIdFromWire(activity.target),
      );
      return stack ? !stack.archived : true;
    }
    if (isTimePlanActivityChoreStackTarget(activity.target)) {
      const stack = targetChoreStacks?.get(
        entityLinkRefIdFromWire(activity.target),
      );
      return stack ? !stack.archived : true;
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
    isTimePlanActivityHabitStackTarget(activity.target) ||
    isTimePlanActivityHabitTarget(activity.target) ||
    isTimePlanActivityChoreStackTarget(activity.target) ||
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

export function sortTimePlanActivitiesBySelectedAttributes(
  timePlanActivities: TimePlanActivity[],
  targetInboxTasks: Map<string, InboxTask>,
  selectedKind: TimePlanActivityKind,
  selectedFeasability: TimePlanActivityFeasability,
): TimePlanActivity[] {
  const naturallySorted = sortTimePlanActivitiesNaturally(
    timePlanActivities,
    targetInboxTasks,
  );

  return [...naturallySorted].sort((left, right) => {
    return (
      selectedAttributeMatchScore(right, selectedKind, selectedFeasability) -
      selectedAttributeMatchScore(left, selectedKind, selectedFeasability)
    );
  });
}

function selectedAttributeMatchScore(
  activity: TimePlanActivity,
  selectedKind: TimePlanActivityKind,
  selectedFeasability: TimePlanActivityFeasability,
): number {
  let score = 0;
  if (activity.kind === selectedKind) {
    score += 1;
  }
  if (activity.feasability === selectedFeasability) {
    score += 1;
  }
  return score;
}

function ownedInboxTaskForTarget(
  inboxTasksByRefId: Map<string, InboxTask>,
  ownerNamespace: string,
  target: string,
): InboxTask | undefined {
  const targetRefId = entityLinkRefIdFromWire(target);
  return [...inboxTasksByRefId.values()].find(
    (inboxTask) =>
      parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) ===
        ownerNamespace &&
      entityLinkRefIdFromWire(inboxTask.owner) === targetRefId,
  );
}

/**
 * How long one block for this activity should be, before any scheduling hint.
 *
 * Derived from the difficulty of whatever the activity points at, and summed
 * over the members of a stack.
 */
function inferBaseDurationMinsForTimePlanActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  bigPlansByRefId: Map<string, BigPlan>,
  habitsByRefId: Map<string, Habit>,
  choresByRefId: Map<string, Chore>,
  habitStacksByRefId?: Map<string, HabitStack>,
  choreStacksByRefId?: Map<string, ChoreStack>,
): number {
  if (isTimePlanActivityInboxTaskTarget(activity.target)) {
    const inboxTask = inboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    );
    if (inboxTask) {
      return inferDurationMinsFromInboxTask(inboxTask);
    }
  } else if (isTimePlanActivityTodoTaskTarget(activity.target)) {
    const ownedInboxTask = ownedInboxTaskForTarget(
      inboxTasksByRefId,
      TODO_TASK,
      activity.target,
    );
    if (ownedInboxTask) {
      return inferDurationMinsFromInboxTask(ownedInboxTask);
    }
  } else if (isTimePlanActivityHabitTarget(activity.target)) {
    const ownedInboxTask = ownedInboxTaskForTarget(
      inboxTasksByRefId,
      HABIT,
      activity.target,
    );
    if (ownedInboxTask) {
      return inferDurationMinsFromInboxTask(ownedInboxTask);
    }
    const habit = habitsByRefId.get(entityLinkRefIdFromWire(activity.target));
    if (habit) {
      return inferDurationMinsFromDifficulty(habit.gen_params.difficulty);
    }
  } else if (isTimePlanActivityHabitStackTarget(activity.target)) {
    const stackRefId = entityLinkRefIdFromWire(activity.target);
    let total = 0;
    let found = false;
    for (const habit of habitsByRefId.values()) {
      if (habit.stack_ref_id === stackRefId) {
        found = true;
        total += inferDurationMinsFromDifficulty(habit.gen_params.difficulty);
      }
    }
    if (found) {
      return total;
    }
    if (habitStacksByRefId?.has(stackRefId)) {
      return inferDurationMinsFromDifficulty(Difficulty.HARD);
    }
  } else if (isTimePlanActivityChoreStackTarget(activity.target)) {
    const stackRefId = entityLinkRefIdFromWire(activity.target);
    let total = 0;
    let found = false;
    for (const chore of choresByRefId.values()) {
      if (chore.stack_ref_id === stackRefId) {
        found = true;
        total += inferDurationMinsFromDifficulty(chore.gen_params.difficulty);
      }
    }
    if (found) {
      return total;
    }
    if (choreStacksByRefId?.has(stackRefId)) {
      return inferDurationMinsFromDifficulty(Difficulty.HARD);
    }
  } else if (isTimePlanActivityChoreTarget(activity.target)) {
    const ownedInboxTask = ownedInboxTaskForTarget(
      inboxTasksByRefId,
      CHORE,
      activity.target,
    );
    if (ownedInboxTask) {
      return inferDurationMinsFromInboxTask(ownedInboxTask);
    }
    const chore = choresByRefId.get(entityLinkRefIdFromWire(activity.target));
    if (chore) {
      return inferDurationMinsFromDifficulty(chore.gen_params.difficulty);
    }
  } else if (isTimePlanActivityBigPlanTarget(activity.target)) {
    const bigPlan = bigPlansByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    );
    if (bigPlan) {
      return inferDurationMinsFromDifficulty(bigPlan.difficulty);
    }
  }

  return inferDurationMinsFromDifficulty(Difficulty.HARD);
}

/** The scheduling params of whatever this activity points at. */
/**
 * The scheduling params of whatever this activity points at.
 *
 * Null when nothing that carries them is loaded, or when the activity is
 * generated by something that has none - a metric collection task, say. The
 * callers then fall back on the duration the difficulty implies, the way
 * everything worked before scheduling params existed.
 */
export function schedulingParamsForTimePlanActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  bigPlansByRefId: Map<string, BigPlan>,
  habitsByRefId: Map<string, Habit>,
  choresByRefId: Map<string, Chore>,
  todoTasksByRefId?: Map<string, TodoTask>,
): SchedulingParams | null {
  if (isTimePlanActivityInboxTaskTarget(activity.target)) {
    const inboxTask = inboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    );
    if (inboxTask === undefined) {
      return null;
    }
    // An inbox task takes after whatever generated it.
    const ownerNamespace = parentLinkNamespaceFromEntityLinkWire(
      inboxTask.owner,
    );
    const ownerRefId = entityLinkRefIdFromWire(inboxTask.owner);
    if (ownerNamespace === HABIT) {
      return habitsByRefId.get(ownerRefId)?.scheduling_params ?? null;
    }
    if (ownerNamespace === CHORE) {
      return choresByRefId.get(ownerRefId)?.scheduling_params ?? null;
    }
    if (ownerNamespace === BIG_PLAN) {
      return bigPlansByRefId.get(ownerRefId)?.scheduling_params ?? null;
    }
    if (ownerNamespace === TODO_TASK) {
      return todoTasksByRefId?.get(ownerRefId)?.scheduling_params ?? null;
    }
    return null;
  }
  if (isTimePlanActivityTodoTaskTarget(activity.target)) {
    return (
      todoTasksByRefId?.get(entityLinkRefIdFromWire(activity.target))
        ?.scheduling_params ?? null
    );
  }
  if (isTimePlanActivityHabitTarget(activity.target)) {
    return (
      habitsByRefId.get(entityLinkRefIdFromWire(activity.target))
        ?.scheduling_params ?? null
    );
  }
  if (isTimePlanActivityChoreTarget(activity.target)) {
    return (
      choresByRefId.get(entityLinkRefIdFromWire(activity.target))
        ?.scheduling_params ?? null
    );
  }
  if (isTimePlanActivityBigPlanTarget(activity.target)) {
    return (
      bigPlansByRefId.get(entityLinkRefIdFromWire(activity.target))
        ?.scheduling_params ?? null
    );
  }
  if (isTimePlanActivityHabitStackTarget(activity.target)) {
    return stackSchedulingParams(
      activity,
      [...habitsByRefId.values()].map((habit) => ({
        stackRefId: habit.stack_ref_id,
        params: habit.scheduling_params,
      })),
    );
  }
  if (isTimePlanActivityChoreStackTarget(activity.target)) {
    return stackSchedulingParams(
      activity,
      [...choresByRefId.values()].map((chore) => ({
        stackRefId: chore.stack_ref_id,
        params: chore.scheduling_params,
      })),
    );
  }
  return null;
}

/**
 * A stack can be scheduled as long as one of its members can be.
 *
 * Its own length comes from summing its members, so the params it reports say
 * only whether it can be scheduled - null where that is simply yes.
 */
function stackSchedulingParams(
  activity: TimePlanActivity,
  members: { stackRefId?: string | null; params: SchedulingParams }[],
): SchedulingParams | null {
  const stackRefId = entityLinkRefIdFromWire(activity.target);
  const ownMembers = members.filter(
    (member) => member.stackRefId === stackRefId,
  );
  if (ownMembers.length === 0) {
    return null;
  }
  if (ownMembers.some((member) => isSchedulable(member.params))) {
    return null;
  }
  return ownMembers[0].params;
}

/** Whether this activity's work belongs in the calendar at all. */
export function isTimePlanActivitySchedulable(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  bigPlansByRefId: Map<string, BigPlan>,
  habitsByRefId: Map<string, Habit>,
  choresByRefId: Map<string, Chore>,
  todoTasksByRefId?: Map<string, TodoTask>,
): boolean {
  return isSchedulable(
    schedulingParamsForTimePlanActivity(
      activity,
      inboxTasksByRefId,
      bigPlansByRefId,
      habitsByRefId,
      choresByRefId,
      todoTasksByRefId,
    ),
  );
}

/**
 * How long one block for this activity should be when it's placed.
 *
 * The duration hint on whatever the activity points at wins over the duration
 * inferred from its difficulty.
 */
export function inferDurationMinsForTimePlanActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  bigPlansByRefId: Map<string, BigPlan>,
  habitsByRefId: Map<string, Habit>,
  choresByRefId: Map<string, Chore>,
  habitStacksByRefId?: Map<string, HabitStack>,
  choreStacksByRefId?: Map<string, ChoreStack>,
  todoTasksByRefId?: Map<string, TodoTask>,
): number {
  const baseDurationMins = inferBaseDurationMinsForTimePlanActivity(
    activity,
    inboxTasksByRefId,
    bigPlansByRefId,
    habitsByRefId,
    choresByRefId,
    habitStacksByRefId,
    choreStacksByRefId,
  );
  return schedulingEventDurationMins(
    schedulingParamsForTimePlanActivity(
      activity,
      inboxTasksByRefId,
      bigPlansByRefId,
      habitsByRefId,
      choresByRefId,
      todoTasksByRefId,
    ),
    baseDurationMins,
  );
}

/**
 * How much time this activity actually needs, over all the blocks it wants.
 *
 * Zero for something that isn't schedulable - a habit like "no sweets today"
 * asks for no time at all.
 */
export function inferRequiredDurationMinsForTimePlanActivity(
  activity: TimePlanActivity,
  inboxTasksByRefId: Map<string, InboxTask>,
  bigPlansByRefId: Map<string, BigPlan>,
  habitsByRefId: Map<string, Habit>,
  choresByRefId: Map<string, Chore>,
  habitStacksByRefId?: Map<string, HabitStack>,
  choreStacksByRefId?: Map<string, ChoreStack>,
  todoTasksByRefId?: Map<string, TodoTask>,
): number {
  const baseDurationMins = inferBaseDurationMinsForTimePlanActivity(
    activity,
    inboxTasksByRefId,
    bigPlansByRefId,
    habitsByRefId,
    choresByRefId,
    habitStacksByRefId,
    choreStacksByRefId,
  );
  return schedulingTotalDurationMins(
    schedulingParamsForTimePlanActivity(
      activity,
      inboxTasksByRefId,
      bigPlansByRefId,
      habitsByRefId,
      choresByRefId,
      todoTasksByRefId,
    ),
    baseDurationMins,
  );
}
