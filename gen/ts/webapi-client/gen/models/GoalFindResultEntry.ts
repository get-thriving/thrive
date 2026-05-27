/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Goal } from './Goal';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * A single goal result.
 */
export type GoalFindResultEntry = {
    goal: Goal;
    tags: Array<Tag>;
    note?: (Note | null);
};

