/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Occasion } from './Occasion';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
/**
 * OccasionLoadResult.
 */
export type OccasionLoadResult = {
    occasion: Occasion;
    tags: Array<Tag>;
    note?: (Note | null);
    occasion_time_event_blocks: Array<TimeEventFullDaysBlock>;
    occasion_tasks: Array<InboxTask>;
};

