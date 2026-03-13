/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * A single entry in the load all habits response.
 */
export type HabitFindResultEntry = {
    habit: Habit;
    aspect?: (Aspect | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks?: (Array<InboxTask> | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
};

