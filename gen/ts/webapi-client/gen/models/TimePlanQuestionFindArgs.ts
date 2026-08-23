/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * TimePlanQuestionFind args.
 */
export type TimePlanQuestionFindArgs = {
    allow_archived?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_periods?: (Array<RecurringTaskPeriod> | null);
};

