/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressLine } from './AddressLine';
import type { CountryCode } from './CountryCode';
import type { EntityId } from './EntityId';
import type { GpsCoordinates } from './GpsCoordinates';
import type { LocationName } from './LocationName';
import type { Timestamp } from './Timestamp';
/**
 * A location.
 */
export type Location = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: LocationName;
    location_domain_ref_id: string;
    address_line?: (AddressLine | null);
    country?: (CountryCode | null);
    gps?: (GpsCoordinates | null);
};

