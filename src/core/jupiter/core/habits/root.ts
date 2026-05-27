import {
  HabitSummary,
  AspectSummary,
  type Habit,
} from "@jupiter/webapi-client";

import { compareDifficulty } from "#/core/common/difficulty";
import { compareEisen } from "#/core/common/eisen";
import { comparePeriods } from "#/core/common/recurring-task-period";
import { compareIsKey } from "#/core/common/is-key";

export function sortHabitsNaturally(habits: Habit[]): Habit[] {
  return [...habits].sort((c1, c2) => {
    if (!c1.suspended && c2.suspended) {
      return -1;
    } else if (c1.suspended && !c2.suspended) {
      return 1;
    }

    return (
      compareIsKey(c1.is_key, c2.is_key) ||
      comparePeriods(c1.gen_params.period, c2.gen_params.period) ||
      compareEisen(c1.gen_params.eisen, c2.gen_params.eisen) ||
      compareDifficulty(c1.gen_params.difficulty, c2.gen_params.difficulty)
    );
  });
}

export function sortHabitSummariesByAspectAndPeriod(
  habits: HabitSummary[],
  sortedAspects: AspectSummary[],
): HabitSummary[] {
  return [...habits].sort((c1, c2) => {
    const aspect1 = sortedAspects.findIndex(
      (p) => p.ref_id === c1.aspect_ref_id,
    );
    const aspect2 = sortedAspects.findIndex(
      (p) => p.ref_id === c2.aspect_ref_id,
    );
    if (aspect1 !== aspect2) {
      return aspect1 - aspect2;
    }
    return comparePeriods(c1.period, c2.period);
  });
}

export function sortHabitSummariesByPeriod(
  habits: HabitSummary[],
): HabitSummary[] {
  return [...habits].sort((c1, c2) => {
    return comparePeriods(c1.period, c2.period);
  });
}
