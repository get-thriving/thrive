/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
import type { LocationLink } from './LocationLink';
/**
 * LocationLinkUpsertFromCandidate result.
 */
export type LocationLinkUpsertFromCandidateResult = {
    new_location: Location;
    location_link: LocationLink;
    deduped: boolean;
};

