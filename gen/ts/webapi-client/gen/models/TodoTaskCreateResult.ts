/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InboxTask } from './InboxTask';
import type { TimePlanActivity } from './TimePlanActivity';
import type { TodoTask } from './TodoTask';
/**
 * TodoTaskCreate result.
 */
export type TodoTaskCreateResult = {
    new_todo_task: TodoTask;
    new_inbox_task: InboxTask;
    new_time_plan_activity?: (TimePlanActivity | null);
};

