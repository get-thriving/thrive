/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { LifePlanEvalApproach } from './LifePlanEvalApproach';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
import type { Schedulability } from './Schedulability';
/**
 * Args.
 */
export type LifePlanUpdateEvalSettingsArgs = {
    eval_periods: {
        should_change: boolean;
        value?: Array<RecurringTaskPeriod>;
    };
    eval_approach: {
        should_change: boolean;
        value?: LifePlanEvalApproach;
    };
    eval_task_eisen: {
        should_change: boolean;
        value?: (Eisen | null);
    };
    eval_task_difficulty: {
        should_change: boolean;
        value?: (Difficulty | null);
    };
    eval_task_generation_in_advance_days: {
        should_change: boolean;
        value?: Record<string, number>;
    };
    schedulability: {
        should_change: boolean;
        value?: Schedulability;
    };
    scheduling_event_duration_mins: {
        should_change: boolean;
        value?: (number | null);
    };
    scheduling_event_count: {
        should_change: boolean;
        value?: (number | null);
    };
};

