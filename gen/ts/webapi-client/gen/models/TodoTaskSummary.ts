/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TodoTaskName } from './TodoTaskName';
/**
 * Summary information about a todo task.
 */
export type TodoTaskSummary = {
    ref_id: EntityId;
    name: TodoTaskName;
    aspect_ref_id: EntityId;
    chapter_ref_id?: (EntityId | null);
    goal_ref_id?: (EntityId | null);
};

