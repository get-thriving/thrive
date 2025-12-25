import { Chapter } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally(
  birthday: DateTime,
  today: DateTime,
  chapters: Chapter[],
): Chapter[] {
  return [...chapters].sort((a, b) => {
    return (
      midDate(a.start_date, birthday, today).toMillis() -
      midDate(b.start_date, birthday, today).toMillis()
    );
  });
}
