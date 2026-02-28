/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { NoteNamespace } from './NoteNamespace';
/**
 * NoteFind args.
 */
export type NoteFindArgs = {
    allow_archived?: (boolean | null);
    filter_namespace?: (Array<NoteNamespace> | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

