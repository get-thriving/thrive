/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { ScheduleEventFullDays } from './ScheduleEventFullDays';
import type { ScheduleStreamSummary } from './ScheduleStreamSummary';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
/**
 * ScheduleEventFullDaysLoadResult.
 */
export type ScheduleEventFullDaysLoadResult = {
    schedule_event_full_days: ScheduleEventFullDays;
    time_event_full_days_block: TimeEventFullDaysBlock;
    note?: (Note | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
    schedule_stream: ScheduleStreamSummary;
    publish_entity?: (PublishEntity | null);
};

