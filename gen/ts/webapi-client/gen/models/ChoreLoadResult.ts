/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Chapter } from './Chapter';
import type { Chore } from './Chore';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * ChoreLoadResult.
 */
export type ChoreLoadResult = {
    chore: Chore;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks: Array<InboxTask>;
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
};

