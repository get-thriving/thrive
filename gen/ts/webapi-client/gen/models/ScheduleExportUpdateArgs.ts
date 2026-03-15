/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ScheduleExportName } from './ScheduleExportName';
/**
 * Args.
 */
export type ScheduleExportUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ScheduleExportName;
    };
    schedule_stream_ref_ids: {
        should_change: boolean;
        value?: Array<EntityId>;
    };
};
