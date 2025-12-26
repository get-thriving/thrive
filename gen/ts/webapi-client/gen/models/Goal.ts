/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { GoalName } from './GoalName';
import type { Timestamp } from './Timestamp';
/**
 * A goal in a life plan.
 */
export type Goal = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: GoalName;
    life_plan_ref_id: string;
    project_ref_id: EntityId;
};

