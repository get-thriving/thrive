/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * One row in ``search_entity_indexing_map``.
 */
export type SearchEntityIndexingRecord = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    search_domain_ref_id: string;
    entity_type: string;
    entity_ref_id: EntityId;
    object_id: string;
    index_method_version: number;
};

