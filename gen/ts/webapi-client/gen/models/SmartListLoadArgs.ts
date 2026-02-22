/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * SmartListLoadArgs.
 */
export type SmartListLoadArgs = {
    ref_id: EntityId;
    allow_archived?: (boolean | null);
    allow_archived_items?: (boolean | null);
    allow_archived_tags?: (boolean | null);
    include_item_tags_and_notes?: (boolean | null);
};

