/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Args.
 */
export type TimePlanFindArgs = {
    allow_archived: boolean;
    include_notes: boolean;
    include_planning_tasks: boolean;
    include_life_plan_ref_ids: boolean;
    include_tags: boolean;
    filter_ref_ids?: (Array<EntityId> | null);
};

