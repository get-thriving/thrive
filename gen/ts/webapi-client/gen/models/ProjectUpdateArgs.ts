/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { ProjectName } from './ProjectName';
import type { ProjectStatus } from './ProjectStatus';
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type ProjectUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ProjectName;
    };
    status: {
        should_change: boolean;
        value?: ProjectStatus;
    };
    aspect_ref_id: {
        should_change: boolean;
        value?: EntityId;
    };
    chapter_ref_id: {
        should_change: boolean;
        value?: (EntityId | null);
    };
    goal_ref_id: {
        should_change: boolean;
        value?: (EntityId | null);
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
};

