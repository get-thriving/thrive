/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chore } from './Chore';
import type { TimePlanActivity } from './TimePlanActivity';
/**
 * ChoreCreate result.
 */
export type ChoreCreateResult = {
    new_chore: Chore;
    new_time_plan_activity?: (TimePlanActivity | null);
};

