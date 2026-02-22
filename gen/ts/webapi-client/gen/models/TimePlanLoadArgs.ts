/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Args.
 */
export type TimePlanLoadArgs = {
    ref_id: EntityId;
    allow_archived?: (boolean | null);
    include_targets?: (boolean | null);
    include_completed_nontarget?: (boolean | null);
    include_other_time_plans?: (boolean | null);
};

