/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
import type { TodoTaskName } from './TodoTaskName';
/**
 * A todo task.
 */
export type TodoTask = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: TodoTaskName;
    todo_domain_ref_id: string;
    aspect_ref_id: EntityId;
    chapter_ref_id?: (EntityId | null);
    goal_ref_id?: (EntityId | null);
};

