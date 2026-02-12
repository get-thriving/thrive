/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { SmartListItem } from './SmartListItem';
import type { Tag } from './Tag';
/**
 * SmartListItemLoadResult.
 */
export type SmartListItemLoadResult = {
    item: SmartListItem;
    generic_tags: Array<Tag>;
    note?: (Note | null);
};

