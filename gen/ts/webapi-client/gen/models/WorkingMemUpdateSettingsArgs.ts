/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
import type { Schedulability } from './Schedulability';
/**
 * PersonFindArgs.
 */
export type WorkingMemUpdateSettingsArgs = {
    generation_period: {
        should_change: boolean;
        value?: RecurringTaskPeriod;
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

