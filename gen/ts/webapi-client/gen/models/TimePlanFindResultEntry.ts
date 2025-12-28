/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { TimePlan } from './TimePlan';
/**
 * Result part.
 */
export type TimePlanFindResultEntry = {
    time_plan: TimePlan;
    note?: (Note | null);
    planning_task?: (InboxTask | null);
    chapter_ref_ids?: (Array<EntityId> | null);
    project_ref_ids?: (Array<EntityId> | null);
    goal_ref_ids?: (Array<EntityId> | null);
};

