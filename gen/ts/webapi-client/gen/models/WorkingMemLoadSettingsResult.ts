/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
import type { SchedulingParams } from './SchedulingParams';
/**
 * WorkingMemLoadSettings results.
 */
export type WorkingMemLoadSettingsResult = {
    generation_period: RecurringTaskPeriod;
    cleanup_task_scheduling_params: SchedulingParams;
    clean_up_inbox_tasks: Array<InboxTask>;
};

