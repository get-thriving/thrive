/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppleAuthCode } from './AppleAuthCode';
import type { AppleRefreshTokenPlain } from './AppleRefreshTokenPlain';
/**
 * Fields we read from Apple's token endpoint response.
 */
export type AppleOAuthTokenResponse = {
    access_token: AppleAuthCode;
    id_token: string;
    refresh_token?: (AppleRefreshTokenPlain | null);
};

