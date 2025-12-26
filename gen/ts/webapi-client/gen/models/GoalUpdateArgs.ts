/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { GoalName } from './GoalName';
/**
 * Goal update args.
 */
export type GoalUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: GoalName;
    };
    project_ref_id: {
        should_change: boolean;
        value?: EntityId;
    };
};

