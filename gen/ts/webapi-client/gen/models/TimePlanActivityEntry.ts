/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlan } from './BigPlan';
import type { InboxTask } from './InboxTask';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlanActivity } from './TimePlanActivity';
/**
 * Result entry.
 */
export type TimePlanActivityEntry = {
    time_plan_activity: TimePlanActivity;
    target_inbox_task?: (InboxTask | null);
    target_big_plan?: (BigPlan | null);
    time_events: Array<TimeEventInDayBlock>;
};

