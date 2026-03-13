/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * AspectLoadResult.
 */
export type AspectLoadResult = {
    aspect: Aspect;
    tags: Array<Tag>;
    note?: (Note | null);
};

