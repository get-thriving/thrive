/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { ScheduleStream } from './ScheduleStream';
import type { Tag } from './Tag';
/**
 * A single entry in the load all schedule streams response.
 */
export type ScheduleStreamFindResultEntry = {
    schedule_stream: ScheduleStream;
    tags: Array<Tag>;
    note?: (Note | null);
};

