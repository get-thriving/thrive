/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Timestamp } from './Timestamp';
/**
 * A single mutation invocation history entry.
 */
export type HistoryEntry = {
    mutation_name: string;
    timestamp: Timestamp;
    source: string;
    result: string;
    error_str?: (string | null);
};

