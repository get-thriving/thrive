/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A link between a time plan and a goal.
 */
export type TimePlanGoalLink = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    time_plan_ref_id: string;
    goal_ref_id: EntityId;
};

