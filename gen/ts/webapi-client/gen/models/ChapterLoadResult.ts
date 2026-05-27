/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chapter } from './Chapter';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * ChapterLoadResult.
 */
export type ChapterLoadResult = {
    chapter: Chapter;
    tags: Array<Tag>;
    note?: (Note | null);
};

