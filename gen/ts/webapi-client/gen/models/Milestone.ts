/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { MilestoneName } from './MilestoneName';
import type { Timestamp } from './Timestamp';
/**
 * A milestone in a life plan.
 */
export type Milestone = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: MilestoneName;
    life_plan_ref_id: string;
    project_ref_id: EntityId;
    date: ADate;
};

