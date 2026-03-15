/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ScheduleExportName } from './ScheduleExportName';
/**
 * Args.
 */
export type ScheduleExportCreateArgs = {
    name: ScheduleExportName;
    schedule_stream_ref_ids: Array<EntityId>;
};
