import { Chapter, MilestoneSummary } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally(
  birthday: DateTime,
  today: DateTime,
  chapters: Chapter[],
  milestones: MilestoneSummary[],
): Chapter[] {
  return [...chapters].sort((a, b) => {
    return (
      midDate(a.start_date, birthday, today, milestones).toMillis() -
      midDate(b.start_date, birthday, today, milestones).toMillis()
    );
  });
}
