/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactNamespace } from './ContactNamespace';
import type { EntityId } from './EntityId';
/**
 * ContactLinkUpsert args.
 */
export type ContactLinkUpsertArgs = {
    namespace: ContactNamespace;
    source_entity_ref_id: EntityId;
    contacts_ref_ids: Array<EntityId>;
};

