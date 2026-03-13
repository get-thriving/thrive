/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * Args.
 */
export type TimePlanCreateArgs = {
    right_now: ADate;
    period: RecurringTaskPeriod;
    chapter_ref_ids?: (Array<EntityId> | null);
    aspect_ref_ids?: (Array<EntityId> | null);
    goal_ref_ids?: (Array<EntityId> | null);
};

