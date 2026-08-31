/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressLine } from './AddressLine';
import type { CountryCode } from './CountryCode';
import type { GpsCoordinates } from './GpsCoordinates';
import type { JupiterWebApiLocationResolver } from './JupiterWebApiLocationResolver';
import type { LocationName } from './LocationName';
/**
 * A location suggested by a resolver, not yet stored in the workspace.
 */
export type LocationResolverCandidate = {
    name: LocationName;
    address_line?: (AddressLine | null);
    country?: (CountryCode | null);
    gps?: (GpsCoordinates | null);
    source: JupiterWebApiLocationResolver;
    source_id?: (string | null);
};

