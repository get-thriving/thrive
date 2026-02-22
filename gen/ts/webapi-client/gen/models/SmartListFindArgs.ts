/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TagName } from './TagName';
/**
 * PersonFindArgs.
 */
export type SmartListFindArgs = {
    allow_archived?: (boolean | null);
    include_notes?: (boolean | null);
    include_tags?: (boolean | null);
    include_items?: (boolean | null);
    include_item_notes?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_is_done?: (boolean | null);
    filter_tag_names?: (Array<TagName> | null);
    filter_tag_ref_id?: (Array<EntityId> | null);
    filter_item_ref_id?: (Array<EntityId> | null);
};

