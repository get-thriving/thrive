/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { MutationId } from './MutationId';
import type { Timestamp } from './Timestamp';
/**
 * A single mutation invocation history entry.
 */
export type InvocationHistoryEntry = {
    mutation_id: MutationId;
    mutation_name: string;
    timestamp: Timestamp;
    source: string;
    user_ref_id: EntityId;
    result: string;
    args_str: string;
    error_str?: (string | null);
};

