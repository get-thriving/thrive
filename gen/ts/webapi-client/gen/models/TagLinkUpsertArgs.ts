/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TagName } from './TagName';
import type { TagNamespace } from './TagNamespace';
/**
 * TagLinkUpsert args.
 */
export type TagLinkUpsertArgs = {
    namespace: TagNamespace;
    source_entity_ref_id: EntityId;
    tag_names: Array<TagName>;
};

