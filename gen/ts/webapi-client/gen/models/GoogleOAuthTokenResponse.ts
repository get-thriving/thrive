/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoogleAuthCode } from './GoogleAuthCode';
import type { GoogleRefreshTokenPlain } from './GoogleRefreshTokenPlain';
/**
 * Fields we read from Google's token endpoint response.
 */
export type GoogleOAuthTokenResponse = {
    access_token: GoogleAuthCode;
    id_token: string;
    refresh_token?: (GoogleRefreshTokenPlain | null);
};

