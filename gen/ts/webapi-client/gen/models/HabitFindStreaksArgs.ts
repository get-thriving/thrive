/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
/**
 * HabitFindStreaksArgs.
 */
export type HabitFindStreaksArgs = {
    filter_ref_ids?: (Array<EntityId> | null);
    filter_only_key?: (boolean | null);
    include_streak_marks_earliest_date?: (ADate | null);
    include_streak_marks_latest_date?: (ADate | null);
};

