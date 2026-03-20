/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { EntityId } from './EntityId';
import type { InboxTaskName } from './InboxTaskName';
/**
 * TodoTaskCreate args.
 */
export type TodoTaskCreateArgs = {
    name: InboxTaskName;
    aspect_ref_id?: (EntityId | null);
    chapter_ref_id?: (EntityId | null);
    goal_ref_id?: (EntityId | null);
    is_key: boolean;
    eisen: Eisen;
    difficulty: Difficulty;
    actionable_date?: (ADate | null);
    due_date?: (ADate | null);
};

