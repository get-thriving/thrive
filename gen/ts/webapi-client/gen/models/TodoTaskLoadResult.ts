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
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TodoTask } from './TodoTask';
/**
 * TodoTaskLoadResult.
 */
export type TodoTaskLoadResult = {
    todo_task: TodoTask;
    inbox_task: InboxTask;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    publish_entity?: (PublishEntity | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
};

