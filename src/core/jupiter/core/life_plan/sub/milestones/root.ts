import { Milestone } from "@jupiter/webapi-client";

import { compareADate } from "#/core/common/adate";

export function sortMilestonesNaturally(milestones: Milestone[]): Milestone[] {
  return [...milestones].sort((m1, m2) => {
    return compareADate(m1.date, m2.date);
  });
}
