/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthClientId } from './OAuthClientId';
import type { OAuthRefreshTokenExternal } from './OAuthRefreshTokenExternal';
/**
 * OAuth token refresh args.
 */
export type OAuthTokenRefreshArgs = {
    refresh_token: OAuthRefreshTokenExternal;
    client_id: OAuthClientId;
};

