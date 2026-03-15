/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { ScheduleExport } from './ScheduleExport';
import type { Tag } from './Tag';
/**
 * A single entry in the find schedule exports response.
 */
export type ScheduleExportFindResultEntry = {
    schedule_export: ScheduleExport;
    tags: Array<Tag>;
    note?: (Note | null);
};

