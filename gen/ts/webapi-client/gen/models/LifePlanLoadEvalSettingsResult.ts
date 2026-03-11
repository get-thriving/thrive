/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { LifePlanEvalApproach } from './LifePlanEvalApproach';
import type { Project } from './Project';
import type { RecurringTaskGenParams } from './RecurringTaskGenParams';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * LifePlanLoadEvalSettings results.
 */
export type LifePlanLoadEvalSettingsResult = {
    eval_periods: Array<RecurringTaskPeriod>;
    eval_approach: LifePlanEvalApproach;
    eval_task_project?: (Project | null);
    eval_task_gen_params?: (RecurringTaskGenParams | null);
    eval_task_generation_in_advance_days: Record<string, number>;
    eval_tasks: Array<InboxTask>;
};
