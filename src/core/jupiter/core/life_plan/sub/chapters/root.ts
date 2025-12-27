import type { ChapterSummary, MilestoneSummary } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally<T extends ChapterSummary>(
  birthday: DateTime,
  today: DateTime,
  chapters: T[],
  milestones: MilestoneSummary[],
): T[] {
  return [...chapters].sort((a, b) => {
    return (
      midDate(a.start_date, birthday, today, milestones).toMillis() -
      midDate(b.start_date, birthday, today, milestones).toMillis()
    );
  });
}
