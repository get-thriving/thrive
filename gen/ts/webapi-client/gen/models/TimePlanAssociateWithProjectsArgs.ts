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
export type TimePlanAssociateWithProjectsArgs = {
    ref_id: EntityId;
    project_ref_ids: Array<EntityId>;
    override_existing_dates: boolean;
    kind: TimePlanActivityKind;
    feasability: TimePlanActivityFeasability;
};

