/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Arguments for loading a directory listing.
 */
export type DirLoadArgs = {
    ref_id: EntityId;
    allow_archived?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

