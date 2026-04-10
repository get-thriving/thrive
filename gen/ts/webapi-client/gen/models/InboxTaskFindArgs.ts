/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { InboxTaskNamespace } from './InboxTaskNamespace';
/**
 * PersonFindArgs.
 */
export type InboxTaskFindArgs = {
    allow_archived?: (boolean | null);
    filter_just_workable?: (boolean | null);
    filter_just_user?: (boolean | null);
    filter_just_generated?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_namespace?: (Array<InboxTaskNamespace> | null);
    filter_source_entity_ref_ids?: (Array<EntityId> | null);
};

