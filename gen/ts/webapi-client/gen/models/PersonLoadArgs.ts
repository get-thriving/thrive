/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * PersonLoadArgs.
 */
export type PersonLoadArgs = {
    ref_id: EntityId;
    allow_archived?: (boolean | null);
    catch_up_task_retrieve_offset?: (number | null);
    occasion_task_retrieve_offset?: (number | null);
};

