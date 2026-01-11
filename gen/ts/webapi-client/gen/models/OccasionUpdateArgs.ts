/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { EntityId } from './EntityId';
import type { OccasionKind } from './OccasionKind';
import type { OccasionName } from './OccasionName';
/**
 * OccasionUpdate args.
 */
export type OccasionUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: OccasionName;
    };
    kind: {
        should_change: boolean;
        value?: OccasionKind;
    };
    date: {
        should_change: boolean;
        value?: Birthday;
    };
};

