/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ScheduleExportName } from './ScheduleExportName';
import type { Timestamp } from './Timestamp';
/**
 * A calendar export configuration that bundles multiple schedule streams.
 */
export type ScheduleExport = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: ScheduleExportName;
    schedule_domain_ref_id: string;
    schedule_stream_ref_ids: Array<EntityId>;
};
