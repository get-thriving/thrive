/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { MilestoneName } from './MilestoneName';
/**
 * Milestone update args.
 */
export type MilestoneUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: MilestoneName;
    };
    date: {
        should_change: boolean;
        value?: ADate;
    };
    aspect_ref_id: {
        should_change: boolean;
        value?: EntityId;
    };
};

