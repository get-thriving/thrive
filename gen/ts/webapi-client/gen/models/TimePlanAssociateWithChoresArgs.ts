/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TimePlanActivityFeasability } from './TimePlanActivityFeasability';
import type { TimePlanActivityKind } from './TimePlanActivityKind';
/**
 * Args.
 */
export type TimePlanAssociateWithChoresArgs = {
    ref_id: EntityId;
    chore_ref_ids: Array<EntityId>;
    kind: TimePlanActivityKind;
    feasability: TimePlanActivityFeasability;
};

