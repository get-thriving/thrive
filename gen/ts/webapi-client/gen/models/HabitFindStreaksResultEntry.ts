/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Habit } from './Habit';
import type { HabitStreakInactivePeriod } from './HabitStreakInactivePeriod';
import type { HabitStreakMark } from './HabitStreakMark';
/**
 * The streak of a single habit.
 */
export type HabitFindStreaksResultEntry = {
    habit: Habit;
    streak_marks: Array<HabitStreakMark>;
    streak_inactive_periods: Array<HabitStreakInactivePeriod>;
};

