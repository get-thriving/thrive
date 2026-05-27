/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { GoalName } from './GoalName';
/**
 * Summary information about a goal.
 */
export type GoalSummary = {
    ref_id: EntityId;
    name: GoalName;
    aspect_ref_id: EntityId;
    parent_goal_ref_id?: (EntityId | null);
};

