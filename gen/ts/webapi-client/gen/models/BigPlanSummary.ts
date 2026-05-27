/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlanName } from './BigPlanName';
import type { EntityId } from './EntityId';
/**
 * Summary information about a big plan.
 */
export type BigPlanSummary = {
    ref_id: EntityId;
    name: BigPlanName;
    aspect_ref_id: EntityId;
    chapter_ref_id?: (EntityId | null);
    goal_ref_id?: (EntityId | null);
    is_key: boolean;
};

