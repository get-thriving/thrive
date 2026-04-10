/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
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
    owner: EntityLink;
    contacts_ref_ids: Array<EntityId>;
};

