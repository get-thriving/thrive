/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { EntityId } from './EntityId';
import type { OccasionKind } from './OccasionKind';
import type { OccasionName } from './OccasionName';
import type { Schedulability } from './Schedulability';
/**
 * OccasionCreate args.
 */
export type OccasionCreateArgs = {
    person_ref_id: EntityId;
    kind: OccasionKind;
    name: OccasionName;
    date: Birthday;
    schedulability?: (Schedulability | null);
    scheduling_event_duration_mins?: (number | null);
    scheduling_event_count?: (number | null);
};

