/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { EntityName } from './EntityName';
import type { TimePlanActivityFeasability } from './TimePlanActivityFeasability';
import type { TimePlanActivityKind } from './TimePlanActivityKind';
import type { Timestamp } from './Timestamp';
/**
 * A certain activity that happens in a plan.
 */
export type TimePlanActivity = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    time_plan_ref_id: string;
    target: EntityLink;
    kind: TimePlanActivityKind;
    feasability: TimePlanActivityFeasability;
};

