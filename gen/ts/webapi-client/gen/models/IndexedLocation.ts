/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * Searchable location properties plus location ref ids for filtering.
 */
export type IndexedLocation = {
    name: string;
    address: string;
    country: string;
    gps: string;
    ref_ids: Array<EntityId>;
};

