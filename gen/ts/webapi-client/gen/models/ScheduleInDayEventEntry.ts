/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
import type { ScheduleEventInDay } from './ScheduleEventInDay';
import type { ScheduleStream } from './ScheduleStream';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { UserLight } from './UserLight';
/**
 * Result entry.
 */
export type ScheduleInDayEventEntry = {
    event: ScheduleEventInDay;
    tags: Array<Tag>;
    location?: (Location | null);
    time_event: TimeEventInDayBlock;
    stream: ScheduleStream;
    owner: UserLight;
};

