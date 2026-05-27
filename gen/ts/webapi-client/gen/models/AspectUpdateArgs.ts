/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AspectName } from './AspectName';
import type { EntityId } from './EntityId';
/**
 * PersonFindArgs.
 */
export type AspectUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: AspectName;
    };
    parent_aspect_ref_id: {
        should_change: boolean;
        value?: (EntityId | null);
    };
};

