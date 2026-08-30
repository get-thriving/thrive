/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressLine } from './AddressLine';
import type { CountryCode } from './CountryCode';
import type { EntityId } from './EntityId';
import type { GpsCoordinates } from './GpsCoordinates';
import type { LocationName } from './LocationName';
/**
 * LocationUpdate args.
 */
export type LocationUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: (LocationName | null);
    };
    address_line: {
        should_change: boolean;
        value?: (AddressLine | null);
    };
    country: {
        should_change: boolean;
        value?: (CountryCode | null);
    };
    gps: {
        should_change: boolean;
        value?: (GpsCoordinates | null);
    };
};
