/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { TaskStatus } from './TaskStatus';
import type { Timestamp } from './Timestamp';
/**
 * TaskUpdate args.
 */
export type TaskUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: EntityName;
    };
    status: {
        should_change: boolean;
        value?: TaskStatus;
    };
    is_key: {
        should_change: boolean;
        value?: boolean;
    };
    eisen: {
        should_change: boolean;
        value?: Eisen;
    };
    difficulty: {
        should_change: boolean;
        value?: Difficulty;
    };
    actionable_date: {
        should_change: boolean;
        value?: (ADate | null);
    };
    due_date: {
        should_change: boolean;
        value?: (ADate | null);
    };
    recurring_timeline: {
        should_change: boolean;
        value?: (string | null);
    };
    recurring_repeat_index: {
        should_change: boolean;
        value?: (number | null);
    };
    recurring_gen_right_now: {
        should_change: boolean;
        value?: (Timestamp | null);
    };
};

