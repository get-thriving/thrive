import {
  Project,
  ProjectStats,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
} from "@jupiter/webapi-client";

import { entityLinkRefIdFromWire } from "#/core/common/sub/inbox_tasks/parent-link-namespace";
import { isTimePlanActivityProjectTarget } from "#/core/apps/time_plans/sub/activity/target-wire";

export interface ProjectProgressSummary {
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

interface ComputeProjectProgressSummaryParams {
  timePlanActivities: TimePlanActivity[];
  targetProjectsByRefId: Map<string, Project>;
  projectStatsByRefId: Map<string, ProjectStats>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
  completedNontargetProjects: Project[];
}

export function computeProjectProgressSummary(
  params: ComputeProjectProgressSummaryParams,
): ProjectProgressSummary {
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
    completedNontargetPlans: params.completedNontargetProjects.length,
    completedNontargetInboxTasks: 0,
    completedNontargetAllInboxTasks: 0,
  };

  for (const activity of params.timePlanActivities) {
    if (!isTimePlanActivityProjectTarget(activity.target)) {
      continue;
    }

    const projectRefId = entityLinkRefIdFromWire(activity.target);
    const project = params.targetProjectsByRefId.get(projectRefId);
    if (project === undefined) {
      continue;
    }

    planned.totalPlans += 1;
    planned.plansByFeasability[activity.feasability] += 1;

    const doneness =
      params.activityDoneness[activity.ref_id] ??
      TimePlanActivityDoneness.NOT_DONE;
    achieved.totalPlansByDoneness[doneness] += 1;
    achieved.plansByFeasabilityByDoneness[doneness][activity.feasability] += 1;

    const stats = params.projectStatsByRefId.get(projectRefId);
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

  for (const project of params.completedNontargetProjects) {
    const stats = params.projectStatsByRefId.get(project.ref_id);
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
