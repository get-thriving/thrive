/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TodoTask } from './TodoTask';
/**
 * Result entry.
 */
export type TodoTaskEntry = {
    todo_task: TodoTask;
    inbox_task: InboxTask;
    time_events: Array<TimeEventInDayBlock>;
};

