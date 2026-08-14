import {
  BigPlan,
  BigPlanStats,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
} from "@jupiter/webapi-client";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityBigPlanTarget } from "#/core/time_plans/sub/activity/target-wire";

export interface BigPlanProgressSummary {
  planned: {
    totalPlans: number;
    plansByFeasability: Record<TimePlanActivityFeasability, number>;
    totalInboxTasks: number;
    inboxTasksByFeasability: Record<TimePlanActivityFeasability, number>;
  };
  achieved: {
    totalPlansByDoneness: Record<TimePlanActivityDoneness, number>;
    plansByFeasabilityByDoneness: Record<
      TimePlanActivityDoneness,
      Record<TimePlanActivityFeasability, number>
    >;
    completedInboxTasks: number;
    completedInboxTasksByFeasability: Record<
      TimePlanActivityFeasability,
      number
    >;
    completedNontargetPlans: number;
    completedNontargetInboxTasks: number;
    completedNontargetAllInboxTasks: number;
  };
}

interface ComputeBigPlanProgressSummaryParams {
  timePlanActivities: TimePlanActivity[];
  targetBigPlansByRefId: Map<string, BigPlan>;
  bigPlanStatsByRefId: Map<string, BigPlanStats>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  completedNontargetBigPlans: BigPlan[];
}

export function computeBigPlanProgressSummary(
  params: ComputeBigPlanProgressSummaryParams,
): BigPlanProgressSummary {
  const planned = {
    totalPlans: 0,
    plansByFeasability: emptyFeasabilityCounts(),
    totalInboxTasks: 0,
    inboxTasksByFeasability: emptyFeasabilityCounts(),
  };
  const achieved = {
    totalPlansByDoneness: emptyDonenessCounts(),
    plansByFeasabilityByDoneness: emptyPlansByFeasabilityByDoneness(),
    completedInboxTasks: 0,
    completedInboxTasksByFeasability: emptyFeasabilityCounts(),
    completedNontargetPlans: params.completedNontargetBigPlans.length,
    completedNontargetInboxTasks: 0,
    completedNontargetAllInboxTasks: 0,
  };

  for (const activity of params.timePlanActivities) {
    if (!isTimePlanActivityBigPlanTarget(activity.target)) {
      continue;
    }

    const bigPlanRefId = entityLinkRefIdFromWire(activity.target);
    const bigPlan = params.targetBigPlansByRefId.get(bigPlanRefId);
    if (bigPlan === undefined) {
      continue;
    }

    planned.totalPlans += 1;
    planned.plansByFeasability[activity.feasability] += 1;

    const doneness =
      params.activityDoneness[activity.ref_id] ??
      TimePlanActivityDoneness.NOT_DONE;
    achieved.totalPlansByDoneness[doneness] += 1;
    achieved.plansByFeasabilityByDoneness[doneness][activity.feasability] += 1;

    const stats = params.bigPlanStatsByRefId.get(bigPlanRefId);
    if (stats === undefined || stats.all_inbox_tasks_cnt <= 0) {
      continue;
    }

    planned.totalInboxTasks += stats.all_inbox_tasks_cnt;
    planned.inboxTasksByFeasability[activity.feasability] +=
      stats.all_inbox_tasks_cnt;
    achieved.completedInboxTasks += stats.completed_inbox_tasks_cnt;
    achieved.completedInboxTasksByFeasability[activity.feasability] +=
      stats.completed_inbox_tasks_cnt;
  }

  for (const bigPlan of params.completedNontargetBigPlans) {
    const stats = params.bigPlanStatsByRefId.get(bigPlan.ref_id);
    if (stats === undefined || stats.all_inbox_tasks_cnt <= 0) {
      continue;
    }
    achieved.completedNontargetAllInboxTasks += stats.all_inbox_tasks_cnt;
    achieved.completedNontargetInboxTasks += stats.completed_inbox_tasks_cnt;
  }

  return { planned, achieved };
}

function emptyFeasabilityCounts(): Record<TimePlanActivityFeasability, number> {
  return {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
}

function emptyDonenessCounts(): Record<TimePlanActivityDoneness, number> {
  return {
    [TimePlanActivityDoneness.DONE]: 0,
    [TimePlanActivityDoneness.WORKING]: 0,
    [TimePlanActivityDoneness.NOT_DONE]: 0,
  };
}

function emptyPlansByFeasabilityByDoneness(): Record<
  TimePlanActivityDoneness,
  Record<TimePlanActivityFeasability, number>
> {
  return {
    [TimePlanActivityDoneness.DONE]: emptyFeasabilityCounts(),
    [TimePlanActivityDoneness.WORKING]: emptyFeasabilityCounts(),
    [TimePlanActivityDoneness.NOT_DONE]: emptyFeasabilityCounts(),
  };
}
