/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ScheduleEventInDayName } from './ScheduleEventInDayName';
import type { ScheduleExternalUid } from './ScheduleExternalUid';
import type { ScheduleStreamSource } from './ScheduleStreamSource';
import type { Timestamp } from './Timestamp';
/**
 * An event in a schedule.
 */
export type ScheduleEventInDay = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: ScheduleEventInDayName;
    schedule_domain_ref_id: string;
    schedule_stream_ref_id: EntityId;
    source: ScheduleStreamSource;
    external_uid?: (ScheduleExternalUid | null);
};

