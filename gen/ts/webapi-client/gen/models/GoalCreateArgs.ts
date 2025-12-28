/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { GoalName } from './GoalName';
/**
 * Goal create args.
 */
export type GoalCreateArgs = {
    name: GoalName;
    project_ref_id: EntityId;
    parent_goal_ref_id?: (EntityId | null);
};

