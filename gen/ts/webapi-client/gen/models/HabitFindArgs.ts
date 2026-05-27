/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type HabitFindArgs = {
    allow_archived?: (boolean | null);
    include_tags?: (boolean | null);
    include_notes?: (boolean | null);
    include_life_plan?: (boolean | null);
    include_inbox_tasks?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
    filter_aspect_ref_ids?: (Array<EntityId> | null);
};

