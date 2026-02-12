/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Milestone } from './Milestone';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * MilestoneLoadResult.
 */
export type MilestoneLoadResult = {
    milestone: Milestone;
    tags: Array<Tag>;
    note?: (Note | null);
};

