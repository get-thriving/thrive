/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Args.
 */
export type TimePlanFindArgs = {
    allow_archived?: (boolean | null);
    include_notes?: (boolean | null);
    include_planning_tasks?: (boolean | null);
    include_life_plan_ref_ids?: (boolean | null);
    include_tags?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

