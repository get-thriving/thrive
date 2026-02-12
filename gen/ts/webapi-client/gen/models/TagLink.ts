/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { TagNamespace } from './TagNamespace';
import type { Timestamp } from './Timestamp';
/**
 * A link between an entity and its tags.
 */
export type TagLink = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    tag_domain_ref_id: string;
    namespace: TagNamespace;
    source_entity_ref_id: EntityId;
    ref_ids: Array<EntityId>;
};

