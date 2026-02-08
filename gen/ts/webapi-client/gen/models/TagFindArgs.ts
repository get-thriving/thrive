/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TagNamespace } from './TagNamespace';
/**
 * TagFind args.
 */
export type TagFindArgs = {
    allow_archived: boolean;
    filter_namespace?: (Array<TagNamespace> | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

