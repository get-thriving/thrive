/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Habit } from './Habit';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * Result entry.
 */
export type HabitEntry = {
    habit: Habit;
    time_events: Array<TimeEventInDayBlock>;
};

