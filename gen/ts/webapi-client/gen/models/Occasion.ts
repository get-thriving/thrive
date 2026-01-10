/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { EntityId } from './EntityId';
import type { OccasionKind } from './OccasionKind';
import type { OccasionName } from './OccasionName';
import type { Timestamp } from './Timestamp';
/**
 * An occasion.
 */
export type Occasion = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: OccasionName;
    person_ref_id: string;
    kind: OccasionKind;
    date: Birthday;
};

