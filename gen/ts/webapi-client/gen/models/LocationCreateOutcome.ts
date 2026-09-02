/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
/**
 * A newly created location, or an existing one reused by dedup.
 */
export type LocationCreateOutcome = {
    location: Location;
    deduped: boolean;
};

