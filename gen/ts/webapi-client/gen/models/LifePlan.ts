/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { LifePlanEvalApproach } from './LifePlanEvalApproach';
import type { RecurringTaskGenParams } from './RecurringTaskGenParams';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
import type { BirthYear } from './BirthYear';
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A project collection.
 */
export type LifePlan = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    workspace_ref_id: string;
    birthday: Birthday;
    birth_year: BirthYear;
    max_age: number;
    time_plan_max_life_plan_links: number;
    eval_periods: Array<RecurringTaskPeriod>;
    eval_approach: LifePlanEvalApproach;
    eval_task_project_ref_id?: (EntityId | null);
    eval_task_gen_params?: (RecurringTaskGenParams | null);
    eval_task_generation_in_advance_days: Record<string, number>;
};

