/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Milestone } from './Milestone';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * A single milestone result.
 */
export type MilestoneFindResultEntry = {
    milestone: Milestone;
    tags: Array<Tag>;
    note?: (Note | null);
};

