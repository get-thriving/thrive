/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TagName } from './TagName';
/**
 * TagUpdate args.
 */
export type TagUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: TagName;
    };
};

