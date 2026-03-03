/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactNamespace } from './ContactNamespace';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { Timestamp } from './Timestamp';
/**
 * A link between an entity and its contacts.
 */
export type ContactLink = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    contact_domain_ref_id: string;
    namespace: ContactNamespace;
    source_entity_ref_id: EntityId;
    contacts_ref_ids: Array<EntityId>;
};

