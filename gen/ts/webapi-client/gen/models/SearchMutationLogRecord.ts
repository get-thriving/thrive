/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MutationId } from './MutationId';
import type { SearchMutationLogStatus } from './SearchMutationLogStatus';
import type { Timestamp } from './Timestamp';
/**
 * One deferred search indexing job keyed by mutation id.
 */
export type SearchMutationLogRecord = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    search_domain_ref_id: string;
    mutation_id: MutationId;
    status: SearchMutationLogStatus;
};

