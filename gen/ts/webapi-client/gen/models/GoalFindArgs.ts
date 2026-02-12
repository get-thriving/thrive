/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * GoalFindArgs.
 */
export type GoalFindArgs = {
    allow_archived: boolean;
    include_notes: boolean;
    include_tags: boolean;
    filter_ref_ids?: (Array<EntityId> | null);
};

