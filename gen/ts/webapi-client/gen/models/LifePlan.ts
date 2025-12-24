/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { BirthYear } from './BirthYear';
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A project collection.
 */
export type LifePlan = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    workspace_ref_id: string;
    birthday: Birthday;
    birth_year: BirthYear;
};

