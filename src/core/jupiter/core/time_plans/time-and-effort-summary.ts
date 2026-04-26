import {
  InboxTask,
  InboxTaskStatus,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
} from "@jupiter/webapi-client";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { inferDurationMinsFromInboxTask } from "#/core/common/sub/inbox_tasks/root";
import { isTimePlanActivityInboxTaskTarget } from "#/core/time_plans/sub/activity/target-wire";
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
    if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
      continue;
    }

    const targetInboxTask = params.targetInboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    )!;
    totalActivities++;
    activitiesByFeasability[activity.feasability]++;
    totalScore += estimateScoreForInboxTask(targetInboxTask);
    scoreByFeasability[activity.feasability] +=
      estimateScoreForInboxTask(targetInboxTask);
    totalHours += inferDurationMinsFromInboxTask(targetInboxTask) / 60;
    hoursByFeasability[activity.feasability] +=
      inferDurationMinsFromInboxTask(targetInboxTask) / 60;
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
    if (!isTimePlanActivityInboxTaskTarget(activity.target)) {
      continue;
    }

    const targetInboxTask = params.targetInboxTasksByRefId.get(
      entityLinkRefIdFromWire(activity.target),
    )!;
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
      totalHours += inferDurationMinsFromInboxTask(targetInboxTask) / 60;
      hoursByFeasability[activity.feasability] +=
        inferDurationMinsFromInboxTask(targetInboxTask) / 60;
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
