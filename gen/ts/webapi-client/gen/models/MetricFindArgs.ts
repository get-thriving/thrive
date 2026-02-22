/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type MetricFindArgs = {
    allow_archived?: (boolean | null);
    include_notes?: (boolean | null);
    include_entries?: (boolean | null);
    include_collection_inbox_tasks?: (boolean | null);
    include_metric_entry_notes?: (boolean | null);
    include_tags?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_entry_ref_ids?: (Array<EntityId> | null);
};

