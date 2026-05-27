/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleFullDaysEventEntry } from './ScheduleFullDaysEventEntry';
import type { ScheduleInDayEventEntry } from './ScheduleInDayEventEntry';
import type { ScheduleStream } from './ScheduleStream';
/**
 * A schedule stream and the events included in the export.
 */
export type ScheduleExportLoadByExternalIdScheduleStreamEntry = {
    schedule_stream: ScheduleStream;
    schedule_event_full_days_entries: Array<ScheduleFullDaysEventEntry>;
    schedule_event_in_day_entries: Array<ScheduleInDayEventEntry>;
};

