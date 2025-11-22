/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { ScheduleEventFullDaysName } from './ScheduleEventFullDaysName';
/**
 * Args.
 */
export type ScheduleEventFullDaysUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ScheduleEventFullDaysName;
    };
    start_date: {
        should_change: boolean;
        value?: ADate;
    };
    duration_days: {
        should_change: boolean;
        value?: number;
    };
};

