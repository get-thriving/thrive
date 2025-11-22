/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { ScheduleEventInDayName } from './ScheduleEventInDayName';
import type { TimeInDay } from './TimeInDay';
/**
 * Args.
 */
export type ScheduleEventInDayCreateArgs = {
    schedule_stream_ref_id: EntityId;
    name: ScheduleEventInDayName;
    start_date: ADate;
    start_time_in_day: TimeInDay;
    duration_mins: number;
};

