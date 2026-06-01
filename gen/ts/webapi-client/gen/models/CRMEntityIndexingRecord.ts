/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * One row in ``crm_entity_indexing_map``.
 */
export type CRMEntityIndexingRecord = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    crm_domain_ref_id: string;
    entity_type: string;
    entity_ref_id: EntityId;
    object_id: string;
    revision: number;
    index_method_version: number;
};

