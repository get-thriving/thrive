/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { Project } from './Project';
import type { Tag } from './Tag';
/**
 * ProjectLoadResult.
 */
export type ProjectLoadResult = {
    project: Project;
    tags: Array<Tag>;
    note?: (Note | null);
};

