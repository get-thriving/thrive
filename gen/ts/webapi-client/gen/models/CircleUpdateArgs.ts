/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CircleName } from './CircleName';
import type { EntityId } from './EntityId';
/**
 * Circle update args.
 */
export type CircleUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: CircleName;
    };
};

