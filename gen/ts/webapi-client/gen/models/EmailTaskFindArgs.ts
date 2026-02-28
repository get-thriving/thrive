/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type EmailTaskFindArgs = {
    allow_archived?: (boolean | null);
    include_inbox_task?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

