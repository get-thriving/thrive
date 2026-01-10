/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { EntityId } from './EntityId';
import type { OccasionKind } from './OccasionKind';
import type { OccasionName } from './OccasionName';
/**
 * OccasionCreate args.
 */
export type OccasionCreateArgs = {
    person_ref_id: EntityId;
    kind: OccasionKind;
    name: OccasionName;
    date: Birthday;
};

