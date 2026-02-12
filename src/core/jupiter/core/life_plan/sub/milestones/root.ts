import type { Milestone, MilestoneSummary } from "@jupiter/webapi-client";

import { compareADate } from "#/core/common/adate";

export function sortMilestonesNaturally<T extends Milestone | MilestoneSummary>(
  milestones: T[],
): T[] {
  return [...milestones].sort((m1, m2) => {
    return compareADate(m1.date, m2.date);
  });
}
