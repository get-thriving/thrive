/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * WorkingMemLoadSettings results.
 */
export type WorkingMemLoadSettingsResult = {
    generation_period: RecurringTaskPeriod;
    clean_up_inbox_tasks: Array<InboxTask>;
};

