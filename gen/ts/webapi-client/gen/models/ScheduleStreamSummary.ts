/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ScheduleStreamColor } from './ScheduleStreamColor';
import type { ScheduleStreamName } from './ScheduleStreamName';
import type { ScheduleStreamSource } from './ScheduleStreamSource';
/**
 * Summary information about a schedule stream.
 */
export type ScheduleStreamSummary = {
    ref_id: EntityId;
    source: ScheduleStreamSource;
    name: ScheduleStreamName;
    color: ScheduleStreamColor;
};

