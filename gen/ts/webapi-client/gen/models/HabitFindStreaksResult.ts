/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { HabitFindStreaksResultEntry } from './HabitFindStreaksResultEntry';
/**
 * HabitFindStreaksResult.
 */
export type HabitFindStreaksResult = {
    streak_mark_earliest_date: ADate;
    streak_mark_latest_date: ADate;
    entries: Array<HabitFindStreaksResultEntry>;
};

