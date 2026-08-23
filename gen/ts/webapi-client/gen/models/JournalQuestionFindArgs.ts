/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * JournalQuestionFind args.
 */
export type JournalQuestionFindArgs = {
    allow_archived?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_periods?: (Array<RecurringTaskPeriod> | null);
};

