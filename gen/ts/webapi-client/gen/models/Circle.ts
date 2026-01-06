/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CircleName } from './CircleName';
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A circle of people, user-defined.
 */
export type Circle = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: CircleName;
    prm_ref_id: string;
};

