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
/**
 * A single entry in the load all chores response.
 */
export type ChoreFindResultEntry = {
    chore: Chore;
    note?: (Note | null);
    aspect?: (Aspect | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks?: (Array<InboxTask> | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
};

