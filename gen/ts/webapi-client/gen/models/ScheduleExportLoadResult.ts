/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { ScheduleExport } from './ScheduleExport';
import type { Tag } from './Tag';
/**
 * Result.
 */
export type ScheduleExportLoadResult = {
    schedule_export: ScheduleExport;
    note?: (Note | null);
    tags: Array<Tag>;
};

