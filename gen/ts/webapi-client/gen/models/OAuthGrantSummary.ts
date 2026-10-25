/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { OAuthClientId } from './OAuthClientId';
import type { OAuthGrantStatus } from './OAuthGrantStatus';
import type { SystemUrl } from './SystemUrl';
import type { Timestamp } from './Timestamp';
/**
 * Summary of an OAuth grant, safe for web display.
 */
export type OAuthGrantSummary = {
    ref_id: EntityId;
    client_id: OAuthClientId;
    redirect_uri: SystemUrl;
    status: OAuthGrantStatus;
    created_time: Timestamp;
    refresh_issued_time?: (Timestamp | null);
    expires_time?: (Timestamp | null);
    archived: boolean;
};

