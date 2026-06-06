import {
  ProjectStats,
  ProjectStatus,
  type Project,
  type ProjectFindResultEntry,
  type Contact,
  type Aspect,
  type Tag,
  type ProjectMilestone,
  Chapter,
  Goal,
} from "@jupiter/webapi-client";

import { compareADate } from "#/core/common/adate";
import { compareProjectStatus } from "#/core/projects/status";
import { compareDifficulty } from "#/core/common/difficulty";
import { compareEisen } from "#/core/common/eisen";
import { compareIsKey } from "#/core/common/is-key";

export interface ProjectParent {
  aspect?: Aspect;
  chapter?: Chapter;
  goal?: Goal;
  tags?: Tag[];
  contacts?: Contact[];
}

export function bigPlanFindEntryToParent(
  entry: ProjectFindResultEntry,
): ProjectParent {
  return {
    aspect: entry.aspect || undefined,
    chapter: entry.chapter || undefined,
    goal: entry.goal || undefined,
    tags: entry.tags || undefined,
    contacts: entry.contacts || undefined,
  };
}

export function sortProjectsNaturally(
  bigPlans: Array<Project>,
): Array<Project> {
  return [...bigPlans].sort((e1, e2) => {
    return (
      compareADate(e1.actionable_date, e2.actionable_date) ||
      compareIsKey(e1.is_key, e2.is_key) ||
      compareADate(e1.due_date, e2.due_date) ||
      -1 * compareEisen(e1.eisen, e2.eisen) ||
      -1 * compareDifficulty(e1.difficulty, e2.difficulty) ||
      compareProjectStatus(e1.status, e2.status)
    );
  });
}

export function bigPlanDonePct(
  bigPlan: Project,
  bigPlanStats: ProjectStats,
): number {
  if (bigPlan.status === ProjectStatus.NOT_STARTED) {
    return 0;
  }

  if (
    bigPlan.status === ProjectStatus.DONE ||
    bigPlan.status === ProjectStatus.NOT_DONE
  ) {
    return 100;
  }

  if (bigPlanStats.all_inbox_tasks_cnt === 0) {
    return 10;
  }

  const pct = Math.floor(
    (bigPlanStats.completed_inbox_tasks_cnt /
      bigPlanStats.all_inbox_tasks_cnt) *
      100,
  );

  if (pct < 10) {
    return 10;
  } else if (pct > 95) {
    return 95;
  }

  return pct;
}

export function sortProjectMilestones(
  milestones: Array<ProjectMilestone>,
): Array<ProjectMilestone> {
  return [...milestones].sort((m1, m2) => {
    return compareADate(m1.date, m2.date);
  });
}
