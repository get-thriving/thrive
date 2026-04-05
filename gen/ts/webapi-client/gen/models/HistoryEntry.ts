/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * An instance of the history.
 */
export type HistoryEntry = {
    entity_name: string;
    mutation_name: string;
    event_kind: string;
    event_name: string;
    timestamp: Timestamp;
    source: string;
    user_ref_id: EntityId;
    entity_version: number;
    data: string;
};

