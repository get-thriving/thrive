/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { SmartList } from './SmartList';
import type { SmartListItem } from './SmartListItem';
import type { Tag } from './Tag';
/**
 * SmartListLoadResult.
 */
export type SmartListLoadResult = {
    smart_list: SmartList;
    tags: Array<Tag>;
    note?: (Note | null);
    smart_list_items: Array<SmartListItem>;
    smart_list_item_generic_tags?: (Record<string, Array<Tag>> | null);
    smart_list_item_notes?: (Array<Note> | null);
};

