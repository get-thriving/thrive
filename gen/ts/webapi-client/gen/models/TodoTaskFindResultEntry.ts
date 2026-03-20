/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TodoTask } from './TodoTask';
/**
 * A single entry in the todo task find response.
 */
export type TodoTaskFindResultEntry = {
    todo_task: TodoTask;
    inbox_task?: (InboxTask | null);
    note?: (Note | null);
    aspect?: (Aspect | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
};

