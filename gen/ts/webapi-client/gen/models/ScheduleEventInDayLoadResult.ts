/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { ScheduleEventInDay } from './ScheduleEventInDay';
import type { ScheduleStreamSummary } from './ScheduleStreamSummary';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * ScheduleEventInDayLoadResult.
 */
export type ScheduleEventInDayLoadResult = {
    schedule_event_in_day: ScheduleEventInDay;
    time_event_in_day_block: TimeEventInDayBlock;
    note?: (Note | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
    schedule_stream: ScheduleStreamSummary;
    publish_entity?: (PublishEntity | null);
};

