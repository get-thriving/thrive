/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
/**
 * Habit streak inactive period update args.
 */
export type HabitStreakInactivePeriodUpdateArgs = {
    ref_id: EntityId;
    name: EntityName;
    start_date: ADate;
    end_date: ADate;
};

