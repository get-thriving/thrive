/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Location } from './Location';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { SmartListItem } from './SmartListItem';
import type { Tag } from './Tag';
/**
 * SmartListItemLoadResult.
 */
export type SmartListItemLoadResult = {
    item: SmartListItem;
    generic_tags: Array<Tag>;
    contacts: Array<Contact>;
    locations: Array<Location>;
    note?: (Note | null);
    publish_entity?: (PublishEntity | null);
};

