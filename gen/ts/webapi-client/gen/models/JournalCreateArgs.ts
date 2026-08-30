/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * JournalCreate args.
 */
export type JournalCreateArgs = {
    right_now: ADate;
    period: RecurringTaskPeriod;
    question_ref_ids?: (Array<EntityId> | null);
    include_aspects?: (boolean | null);
    include_goals?: (boolean | null);
};

