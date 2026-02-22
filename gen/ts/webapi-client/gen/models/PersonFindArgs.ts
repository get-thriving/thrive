/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type PersonFindArgs = {
    allow_archived?: (boolean | null);
    include_occasions?: (boolean | null);
    include_circle_ref_ids?: (boolean | null);
    include_notes?: (boolean | null);
    include_occasion_time_event_blocks?: (boolean | null);
    include_catch_up_inbox_tasks?: (boolean | null);
    include_occasion_inbox_tasks?: (boolean | null);
    include_tags?: (boolean | null);
    filter_person_ref_ids?: (Array<EntityId> | null);
};

