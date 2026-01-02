/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { ProjectName } from './ProjectName';
/**
 * PersonFindArgs.
 */
export type ProjectUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ProjectName;
    };
    parent_project_ref_id: {
        should_change: boolean;
        value?: (EntityId | null);
    };
};

