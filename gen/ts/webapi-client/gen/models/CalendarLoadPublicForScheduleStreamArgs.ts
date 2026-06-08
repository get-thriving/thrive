/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { PublishExternalId } from './PublishExternalId';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * CalendarLoadPublicForScheduleStream args.
 */
export type CalendarLoadPublicForScheduleStreamArgs = {
    external_id: PublishExternalId;
    right_now: ADate;
    period: RecurringTaskPeriod;
    stats_subperiod?: (RecurringTaskPeriod | null);
};

