/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { InboxTask } from './InboxTask';
import type { Metric } from './Metric';
import type { MetricEntry } from './MetricEntry';
import type { MetricLoadMetricEntryTags } from './MetricLoadMetricEntryTags';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
/**
 * MetricLoadResult.
 */
export type MetricLoadResult = {
    metric: Metric;
    note?: (Note | null);
    tags: Array<Tag>;
    metric_entries: Array<MetricEntry>;
    metric_entry_tags: Array<MetricLoadMetricEntryTags>;
    metric_entry_contacts?: (Record<string, Array<Contact>> | null);
    collection_tasks: Array<InboxTask>;
    collection_tasks_total_cnt: number;
    collection_tasks_page_size: number;
    publish_entity?: (PublishEntity | null);
};

