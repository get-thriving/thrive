/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { TaskNamespace } from './TaskNamespace';
import type { TaskStatus } from './TaskStatus';
import type { Timestamp } from './Timestamp';
/**
 * A task in the task domain.
 */
export type Task = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    task_domain_ref_id: string;
    namespace: TaskNamespace;
    source_entity_ref_id: EntityId;
    status: TaskStatus;
    is_key: boolean;
    eisen: Eisen;
    difficulty: Difficulty;
    actionable_date?: (ADate | null);
    due_date?: (ADate | null);
    recurring_timeline?: (string | null);
    recurring_repeat_index?: (number | null);
    recurring_gen_right_now?: (Timestamp | null);
    working_time?: (Timestamp | null);
    completed_time?: (Timestamp | null);
};

