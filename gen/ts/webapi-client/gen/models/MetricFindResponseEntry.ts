/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Contact } from './Contact';
import type { InboxTask } from './InboxTask';
import type { Location } from './Location';
import type { Metric } from './Metric';
import type { MetricEntry } from './MetricEntry';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * A single entry in the LoadAllMetricsResponse.
 */
export type MetricFindResponseEntry = {
    metric: Metric;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    locations: Array<Location>;
    note?: (Note | null);
    metric_entries?: (Array<MetricEntry> | null);
    metric_collection_inbox_tasks?: (Array<InboxTask> | null);
    metric_entry_notes?: (Array<Note> | null);
    owner: UserLight;
    access_status: AccessStatus;
};

