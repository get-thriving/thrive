import type {
  ADate,
  ChapterSummary,
  MilestoneSummary,
  AspectSummary,
} from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { dateToAdate } from "#/core/common/adate";
import type { ChapterForSuggestions } from "#/core/common/suggested-date";
import { midDate } from "#/core/life_plan/partial-date";

export function sortChaptersNaturally<T extends ChapterSummary>(
  birthday: DateTime,
  today: DateTime,
  chapters: T[],
  milestones: MilestoneSummary[],
  sortedAspects: AspectSummary[],
): T[] {
  return [...chapters].sort((a, b) => {
    const aspectA = sortedAspects.find(
      (aspect) => aspect.ref_id === a.aspect_ref_id,
    );
    const aspectB = sortedAspects.find(
      (aspect) => aspect.ref_id === b.aspect_ref_id,
    );
    if (aspectA && aspectB) {
      return aspectA.name.localeCompare(aspectB.name);
    }

    return (
      midDate(a.start_date, birthday, today, milestones).toMillis() -
      midDate(b.start_date, birthday, today, milestones).toMillis()
    );
  });
}

export function resolveChapterForSuggestions(
  chapter: ChapterSummary,
  birthday: DateTime,
  today: DateTime,
  milestones: MilestoneSummary[],
): ChapterForSuggestions {
  return {
    name: chapter.name,
    start_date: dateToAdate(
      midDate(chapter.start_date, birthday, today, milestones),
    ) as ADate,
    end_date: dateToAdate(
      midDate(chapter.end_date, birthday, today, milestones),
    ) as ADate,
  };
}

export function findActiveChapterForSuggestions(
  chapters: ChapterSummary[],
  birthday: DateTime,
  today: DateTime,
  milestones: MilestoneSummary[],
): ChapterForSuggestions | null {
  for (const chapter of chapters) {
    try {
      const resolved = resolveChapterForSuggestions(
        chapter,
        birthday,
        today,
        milestones,
      );
      if (
        resolved.start_date <= today.toISODate()! &&
        today.toISODate()! <= resolved.end_date
      ) {
        return resolved;
      }
    } catch {
      // Skip chapters whose dates can't be resolved
    }
  }
  return null;
}

export function resolveChaptersForSuggestions(
  chapters: ChapterSummary[],
  birthday: DateTime,
  today: DateTime,
  milestones: MilestoneSummary[],
): ChapterForSuggestions[] {
  const resolved: ChapterForSuggestions[] = [];
  for (const chapter of chapters) {
    try {
      resolved.push(
        resolveChapterForSuggestions(chapter, birthday, today, milestones),
      );
    } catch {
      // Skip chapters whose dates can't be resolved
    }
  }
  return resolved;
}

export function findActiveChaptersForSuggestions(
  chapters: ChapterSummary[],
  birthday: DateTime,
  today: DateTime,
  milestones: MilestoneSummary[],
): ChapterForSuggestions[] {
  const todayIso = today.toISODate();
  if (!todayIso) {
    return [];
  }

  return resolveChaptersForSuggestions(
    chapters,
    birthday,
    today,
    milestones,
  ).filter(
    (chapter) => chapter.start_date <= todayIso && todayIso <= chapter.end_date,
  );
}
