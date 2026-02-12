/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { Journal } from './Journal';
import type { JournalStats } from './JournalStats';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * Result part.
 */
export type JournalFindResultEntry = {
    journal: Journal;
    tags: Array<Tag>;
    note?: (Note | null);
    journal_stats?: (JournalStats | null);
    writing_task?: (InboxTask | null);
};

