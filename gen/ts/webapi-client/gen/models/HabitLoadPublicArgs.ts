/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { PublishExternalId } from './PublishExternalId';
/**
 * HabitLoadPublic args.
 */
export type HabitLoadPublicArgs = {
    external_id: PublishExternalId;
    inbox_task_retrieve_offset?: (number | null);
    include_streak_marks_earliest_date?: (ADate | null);
    include_streak_marks_latest_date?: (ADate | null);
};

