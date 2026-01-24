import type {
  ChapterSummary,
  MilestoneSummary,
  ProjectSummary,
} from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally<T extends ChapterSummary>(
  birthday: DateTime,
  today: DateTime,
  chapters: T[],
  milestones: MilestoneSummary[],
  sortedProjects: ProjectSummary[],
): T[] {
  return [...chapters].sort((a, b) => {
    const projectA = sortedProjects.find(
      (project) => project.ref_id === a.project_ref_id,
    );
    const projectB = sortedProjects.find(
      (project) => project.ref_id === b.project_ref_id,
    );
    if (projectA && projectB) {
      return projectA.name.localeCompare(projectB.name);
    }

    return (
      midDate(a.start_date, birthday, today, milestones).toMillis() -
      midDate(b.start_date, birthday, today, milestones).toMillis()
    );
  });
}
