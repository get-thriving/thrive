/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Contact } from './Contact';
import type { Location } from './Location';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { SmartList } from './SmartList';
import type { SmartListItem } from './SmartListItem';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * SmartListLoadResult.
 */
export type SmartListLoadResult = {
    smart_list: SmartList;
    tags: Array<Tag>;
    note?: (Note | null);
    smart_list_items: Array<SmartListItem>;
    smart_list_item_generic_tags?: (Record<string, Array<Tag>> | null);
    smart_list_item_contacts?: (Record<string, Array<Contact>> | null);
    smart_list_item_locations?: (Record<string, Array<Location>> | null);
    smart_list_item_notes?: (Array<Note> | null);
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

