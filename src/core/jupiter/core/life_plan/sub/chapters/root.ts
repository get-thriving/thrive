import { Chapter } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally(
  birthday: DateTime,
  chapters: Chapter[],
): Chapter[] {
  return [...chapters].sort((a, b) => {
    return (
      midDate(birthday, a.start_date).toMillis() -
      midDate(birthday, b.start_date).toMillis()
    );
  });
}
