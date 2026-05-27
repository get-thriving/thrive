/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Args.
 */
export type ScheduleStreamFindArgs = {
    include_notes?: (boolean | null);
    include_tags?: (boolean | null);
    allow_archived?: (boolean | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

