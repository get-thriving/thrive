import { Chapter } from "@jupiter/webapi-client";
import { midDate } from "../../partial-date";
import { DateTime } from "luxon";

export function sortChaptersNaturally(birthday: DateTime, chapters: Chapter[]): Chapter[] {
  return [...chapters].sort((a, b) => {
    return midDate(birthday, a.start_date).toMillis() - midDate(birthday, b.start_date).toMillis();
  });
}