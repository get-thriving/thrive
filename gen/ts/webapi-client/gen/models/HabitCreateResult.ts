/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Habit } from './Habit';
import type { TimePlanActivity } from './TimePlanActivity';
/**
 * HabitCreate result.
 */
export type HabitCreateResult = {
    new_habit: Habit;
    new_time_plan_activity?: (TimePlanActivity | null);
};

