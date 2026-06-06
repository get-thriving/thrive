/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Project } from './Project';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlanActivity } from './TimePlanActivity';
/**
 * TimePlanActivityLoadResult.
 */
export type TimePlanActivityLoadResult = {
    time_plan_activity: TimePlanActivity;
    target_inbox_task?: (InboxTask | null);
    target_project?: (Project | null);
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
};

