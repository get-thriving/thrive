/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Note } from './Note';
import type { SmartList } from './SmartList';
import type { SmartListItem } from './SmartListItem';
import type { Tag } from './Tag';
/**
 * A single entry in the LoadAllSmartListsResponse.
 */
export type SmartListFindResponseEntry = {
    smart_list: SmartList;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    smart_list_items?: (Array<SmartListItem> | null);
    smart_list_item_generic_tags?: (Record<string, Array<Tag>> | null);
    smart_list_item_notes?: (Array<Note> | null);
};

