/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type VacationFindArgs = {
    allow_archived: boolean;
    include_notes: boolean;
    include_time_event_blocks: boolean;
    include_tags: boolean;
    filter_ref_ids?: (Array<EntityId> | null);
};

