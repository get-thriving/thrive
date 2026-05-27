/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * NoteFind args.
 */
export type NoteFindArgs = {
    allow_archived?: (boolean | null);
    filter_owner_types?: (Array<string> | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

