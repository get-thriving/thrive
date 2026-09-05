/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
import type { ScheduleEventFullDays } from './ScheduleEventFullDays';
import type { ScheduleStream } from './ScheduleStream';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
import type { UserLight } from './UserLight';
/**
 * Result entry.
 */
export type ScheduleFullDaysEventEntry = {
    event: ScheduleEventFullDays;
    tags: Array<Tag>;
    location?: (Location | null);
    time_event: TimeEventFullDaysBlock;
    stream: ScheduleStream;
    owner: UserLight;
};

