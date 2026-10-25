/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthTokenExt } from './AuthTokenExt';
import type { OAuthRefreshTokenExternal } from './OAuthRefreshTokenExternal';
/**
 * OAuth token exchange result: a short-lived MCP token and the first refresh token.
 */
export type OAuthTokenExchangeResult = {
    auth_token_ext: AuthTokenExt;
    refresh_token: OAuthRefreshTokenExternal;
    expires_in_secs: number;
};

