/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthTokenExt } from './AuthTokenExt';
import type { OAuthRefreshTokenExternal } from './OAuthRefreshTokenExternal';
/**
 * OAuth token refresh result: a fresh MCP token and the next refresh token.
 */
export type OAuthTokenRefreshResult = {
    auth_token_ext: AuthTokenExt;
    refresh_token: OAuthRefreshTokenExternal;
    expires_in_secs: number;
};

