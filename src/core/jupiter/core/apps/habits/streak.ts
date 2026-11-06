import { ADate, EntityId, HabitStreakMark } from "@jupiter/webapi-client";

import { aDateToDate } from "#/core/common/adate";
import type { StreakInactivePeriodRange } from "#/core/apps/habits/streak-calendar";

export interface KeyHabitStreak {
  habitRefId: EntityId;
  streakMarkEarliestDate: ADate;
  streakMarkLatestDate: ADate;
  streakMarks: HabitStreakMark[];
  inactivePeriods: StreakInactivePeriodRange[];
}

/**
 * Picks the entries for the habits a widget is set up to show, in the order it
 * was set up to show them.
 *
 * A habit the widget points at but that has no entry - archived since, or no
 * longer shared with the user - is left out rather than shown broken.
 */
export function selectKeyHabitStreakEntries<
  T extends { habit: { ref_id: EntityId } },
>(entries: T[], habitRefIds: EntityId[]): T[] {
  const entriesByHabitRefId = new Map(entries.map((e) => [e.habit.ref_id, e]));
  return habitRefIds
    .map((refId) => entriesByHabitRefId.get(refId))
    .filter((entry): entry is T => entry !== undefined);
}

export function limitKeyHabitResultsBasedOnScreenSize(
  keyHabitStreaks: KeyHabitStreak[],
  daysToRestrict: number,
): KeyHabitStreak[] {
  return keyHabitStreaks.map((h) => {
    const latestDate = h.streakMarkLatestDate;
    const realEarliestDate = aDateToDate(latestDate)
      .minus({ days: daysToRestrict })
      .toISODate();

    return {
      ...h,
      streakMarkEarliestDate: realEarliestDate,
      streakMarks: h.streakMarks.filter((s) => s.date >= realEarliestDate),
      inactivePeriods: h.inactivePeriods,
    };
  });
}
