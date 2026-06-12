/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * MetricLoadArgs.
 */
export type MetricLoadArgs = {
    ref_id: EntityId;
    allow_archived?: (boolean | null);
    allow_archived_entries?: (boolean | null);
    collection_task_retrieve_offset?: (number | null);
    include_entry_tags_and_contacts?: (boolean | null);
};

