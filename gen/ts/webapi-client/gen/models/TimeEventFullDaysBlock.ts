/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { EntityName } from './EntityName';
import type { Timestamp } from './Timestamp';
/**
 * A full day block of time.
 */
export type TimeEventFullDaysBlock = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    time_event_domain_ref_id: string;
    owner: EntityLink;
    start_date: ADate;
    duration_days: number;
    end_date: ADate;
};

