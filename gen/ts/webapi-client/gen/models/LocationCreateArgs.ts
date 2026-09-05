/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressLine } from './AddressLine';
import type { CountryCode } from './CountryCode';
import type { GpsCoordinates } from './GpsCoordinates';
import type { LocationName } from './LocationName';
/**
 * LocationCreate args.
 */
export type LocationCreateArgs = {
    name?: (LocationName | null);
    address_line?: (AddressLine | null);
    country?: (CountryCode | null);
    gps?: (GpsCoordinates | null);
    is_key: boolean;
};

