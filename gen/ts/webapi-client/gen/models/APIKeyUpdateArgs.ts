/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { APIKeyName } from './APIKeyName';
import type { EntityId } from './EntityId';
/**
 * API key update args.
 */
export type APIKeyUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: APIKeyName;
    };
};

