/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { APIKeyName } from './APIKeyName';
import type { EntityId } from './EntityId';
/**
 * Summary of an API key, safe for web display.
 */
export type APIKeySummary = {
    ref_id: EntityId;
    name: APIKeyName;
    last_four_digits: string;
    archived: boolean;
};

