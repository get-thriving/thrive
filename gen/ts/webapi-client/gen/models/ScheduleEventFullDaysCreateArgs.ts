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
export type ScheduleEventFullDaysCreateArgs = {
    schedule_stream_ref_id: EntityId;
    name: ScheduleEventFullDaysName;
    start_date: ADate;
    duration_days: number;
};

