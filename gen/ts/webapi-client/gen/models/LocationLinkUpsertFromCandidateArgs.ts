/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressLine } from './AddressLine';
import type { CountryCode } from './CountryCode';
import type { EntityLink } from './EntityLink';
import type { GpsCoordinates } from './GpsCoordinates';
import type { LocationName } from './LocationName';
/**
 * LocationLinkUpsertFromCandidate args.
 */
export type LocationLinkUpsertFromCandidateArgs = {
    owner: EntityLink;
    name?: (LocationName | null);
    address_line?: (AddressLine | null);
    country?: (CountryCode | null);
    gps?: (GpsCoordinates | null);
};

