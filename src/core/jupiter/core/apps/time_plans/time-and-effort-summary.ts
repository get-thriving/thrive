import {
  BigPlan,
  Chore,
  Habit,
  InboxTask,
  InboxTaskStatus,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TodoTask,
} from "@jupiter/webapi-client";

import {
  TODO_TASK,
  HABIT,
  CHORE,
  entityLinkRefIdFromWire,
  parentLinkNamespaceFromEntityLinkWire,
} from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import {
  isTimePlanActivityInboxTaskTarget,
  isTimePlanActivityHabitTarget,
  isTimePlanActivityChoreTarget,
  isTimePlanActivityTodoTaskTarget,
} from "#/core/apps/time_plans/sub/activity/target-wire";
import {
  inferRequiredDurationMinsForTimePlanActivity,
  isTimePlanActivitySchedulable,
} from "#/core/apps/time_plans/sub/activity/root";
import { estimateScoreForInboxTask } from "#/core/gamification/scores";

export interface TimeAndEffortSummary {
  planned: {
    totalActivities: number;
    activitiesByFeasability: Record<TimePlanActivityFeasability, number>;
    totalScore: number;
    scoreByFeasability: Record<TimePlanActivityFeasability, number>;
    totalHours: number;
    hoursByFeasability: Record<TimePlanActivityFeasability, number>;
  };
  achieved: {
    totalActivitiesByDoneness: Record<TimePlanActivityDoneness, number>;
    completedNontargetDoneActivities: number;
    completedNontargetDoneScore: number;
    activitiesByFeasabilityByDoneness: Record<
      TimePlanActivityDoneness,
      Record<TimePlanActivityFeasability, number>
    >;
    totalScoreByDoneness: Record<TimePlanActivityDoneness, number>;
    scoreByFeasabilityByDoneness: Record<
      TimePlanActivityDoneness,
      Record<TimePlanActivityFeasability, number>
    >;
    totalHours: number;
    hoursByFeasability: Record<TimePlanActivityFeasability, number>;
  };
}

interface ComputeTimeAndEffortSummaryParams {
  timePlanActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  completedNontargetInboxTasks: InboxTask[];
  // Needed to tell what an activity's scheduling params are. An activity whose
  // entity isn't here is treated as schedulable, like everything was before
  // scheduling params existed.
  targetBigPlansByRefId?: Map<string, BigPlan>;
  targetHabitsByRefId?: Map<string, Habit>;
  targetChoresByRefId?: Map<string, Chore>;
  targetTodoTasksByRefId?: Map<string, TodoTask>;
}

/**
 * Whether this activity counts towards the plan's load.
 *
 * Something that can't be scheduled - "no sweets today" - takes up no time
 * and so doesn't weigh on the plan at all.
 */
function activityCountsTowardsLoad(
  activity: TimePlanActivity,
  params: ComputeTimeAndEffortSummaryParams,
): boolean {
  return isTimePlanActivitySchedulable(
    activity,
    params.targetInboxTasksByRefId,
    params.targetBigPlansByRefId ?? new Map(),
    params.targetHabitsByRefId ?? new Map(),
    params.targetChoresByRefId ?? new Map(),
    params.targetTodoTasksByRefId,
  );
}

/** The hours this activity asks for, following its scheduling hints. */
function activityRequiredHours(
  activity: TimePlanActivity,
  params: ComputeTimeAndEffortSummaryParams,
): number {
  return (
    inferRequiredDurationMinsForTimePlanActivity(
      activity,
      params.targetInboxTasksByRefId,
      params.targetBigPlansByRefId ?? new Map(),
      params.targetHabitsByRefId ?? new Map(),
      params.targetChoresByRefId ?? new Map(),
      undefined,
      undefined,
      params.targetTodoTasksByRefId,
    ) / 60
  );
}

export function computeTimeAndEffortSummary(
  params: ComputeTimeAndEffortSummaryParams,
): TimeAndEffortSummary {
  return {
    planned: computePlannedTimeAndEffortSummary(params).planned,
    achieved: computeAchievedTimeAndEffortSummary(params).achieved,
  };
}

function computePlannedTimeAndEffortSummary(
  params: ComputeTimeAndEffortSummaryParams,
): Omit<TimeAndEffortSummary, "achieved"> {
  let totalActivities = 0;
  const activitiesByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
  let totalScore = 0;
  const scoreByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
  let totalHours = 0;
  const hoursByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };

  for (const activity of params.timePlanActivities) {
    const targetInboxTask = resolveTargetInboxTask(activity, params);
    if (targetInboxTask === undefined) {
      continue;
    }
    if (!activityCountsTowardsLoad(activity, params)) {
      continue;
    }
    totalActivities++;
    activitiesByFeasability[activity.feasability]++;
    totalScore += estimateScoreForInboxTask(targetInboxTask);
    scoreByFeasability[activity.feasability] +=
      estimateScoreForInboxTask(targetInboxTask);
    const requiredHours = activityRequiredHours(activity, params);
    totalHours += requiredHours;
    hoursByFeasability[activity.feasability] += requiredHours;
  }

  return {
    planned: {
      totalActivities: totalActivities,
      activitiesByFeasability: activitiesByFeasability,
      totalScore: totalScore,
      scoreByFeasability: scoreByFeasability,
      totalHours: totalHours,
      hoursByFeasability: hoursByFeasability,
    },
  };
}

function computeAchievedTimeAndEffortSummary(
  params: ComputeTimeAndEffortSummaryParams,
): Omit<TimeAndEffortSummary, "planned"> {
  const totalActivitiesByDoneness: Record<TimePlanActivityDoneness, number> = {
    [TimePlanActivityDoneness.DONE]: 0,
    [TimePlanActivityDoneness.WORKING]: 0,
    [TimePlanActivityDoneness.NOT_DONE]: 0,
  };
  const activitiesByFeasabilityByDoneness: Record<
    TimePlanActivityDoneness,
    Record<TimePlanActivityFeasability, number>
  > = {
    [TimePlanActivityDoneness.DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.WORKING]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.NOT_DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
  };
  const totalScoreByDoneness: Record<TimePlanActivityDoneness, number> = {
    [TimePlanActivityDoneness.DONE]: 0,
    [TimePlanActivityDoneness.WORKING]: 0,
    [TimePlanActivityDoneness.NOT_DONE]: 0,
  };
  const scoreByFeasabilityByDoneness: Record<
    TimePlanActivityDoneness,
    Record<TimePlanActivityFeasability, number>
  > = {
    [TimePlanActivityDoneness.DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.WORKING]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.NOT_DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
  };
  let totalHours: number = 0;
  const hoursByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
  const completedNontargetDoneActivities =
    params.completedNontargetInboxTasks.filter(
      (task) => task.status === InboxTaskStatus.DONE,
    ).length;
  const completedNontargetDoneScore = params.completedNontargetInboxTasks
    .filter((task) => task.status === InboxTaskStatus.DONE)
    .reduce((sum, task) => sum + estimateScoreForInboxTask(task), 0);

  for (const activity of params.timePlanActivities) {
    const targetInboxTask = resolveTargetInboxTask(activity, params);
    if (targetInboxTask === undefined) {
      continue;
    }
    if (!activityCountsTowardsLoad(activity, params)) {
      continue;
    }
    const doneness =
      params.activityDoneness[activity.ref_id] ??
      TimePlanActivityDoneness.NOT_DONE;
    totalActivitiesByDoneness[doneness]++;
    activitiesByFeasabilityByDoneness[doneness][activity.feasability]++;
    totalScoreByDoneness[doneness] +=
      estimateScoreForInboxTask(targetInboxTask);
    scoreByFeasabilityByDoneness[doneness][activity.feasability] +=
      estimateScoreForInboxTask(targetInboxTask);

    if (
      doneness === TimePlanActivityDoneness.DONE ||
      doneness === TimePlanActivityDoneness.WORKING
    ) {
      const requiredHours = activityRequiredHours(activity, params);
      totalHours += requiredHours;
      hoursByFeasability[activity.feasability] += requiredHours;
    }
  }

  return {
    achieved: {
      totalActivitiesByDoneness: totalActivitiesByDoneness,
      completedNontargetDoneActivities: completedNontargetDoneActivities,
      completedNontargetDoneScore: completedNontargetDoneScore,
      activitiesByFeasabilityByDoneness: activitiesByFeasabilityByDoneness,
      totalScoreByDoneness: totalScoreByDoneness,
      scoreByFeasabilityByDoneness: scoreByFeasabilityByDoneness,
      totalHours: totalHours,
      hoursByFeasability: hoursByFeasability,
    },
  };
}

function resolveTargetInboxTask(
  activity: TimePlanActivity,
  params: ComputeTimeAndEffortSummaryParams,
): InboxTask | undefined {
  if (isTimePlanActivityInboxTaskTarget(activity.target)) {
    return params.targetInboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    );
  }
  if (isTimePlanActivityTodoTaskTarget(activity.target)) {
    return [...params.targetInboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === TODO_TASK &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(activity.target),
    );
  }
  if (isTimePlanActivityHabitTarget(activity.target)) {
    return [...params.targetInboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === HABIT &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(activity.target),
    );
  }
  if (isTimePlanActivityChoreTarget(activity.target)) {
    return [...params.targetInboxTasksByRefId.values()].find(
      (inboxTask) =>
        parentLinkNamespaceFromEntityLinkWire(inboxTask.owner) === CHORE &&
        entityLinkRefIdFromWire(inboxTask.owner) ===
          entityLinkRefIdFromWire(activity.target),
    );
  }
  return undefined;
}
