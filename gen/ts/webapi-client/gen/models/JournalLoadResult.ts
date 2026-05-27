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
 * Result.
 */
export type JournalLoadResult = {
    journal: Journal;
    tags: Array<Tag>;
    note: Note;
    journal_stats: JournalStats;
    writing_task?: (InboxTask | null);
    sub_period_journals: Array<Journal>;
};

