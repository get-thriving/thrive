/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactName } from './ContactName';
import type { ContactNamespace } from './ContactNamespace';
import type { EntityId } from './EntityId';
/**
 * ContactLinkUpsert args.
 */
export type ContactLinkUpsertArgs = {
    namespace: ContactNamespace;
    source_entity_ref_id: EntityId;
    contact_names: Array<ContactName>;
};

