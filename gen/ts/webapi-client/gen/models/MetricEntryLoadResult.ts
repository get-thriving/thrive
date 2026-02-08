/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetricEntry } from './MetricEntry';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * MetricEntryLoadResult.
 */
export type MetricEntryLoadResult = {
    metric_entry: MetricEntry;
    tags: Array<Tag>;
    note?: (Note | null);
};

