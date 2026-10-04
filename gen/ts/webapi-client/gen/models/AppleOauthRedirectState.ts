/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemUrl } from './SystemUrl';
/**
 * OAuth state embedding post-auth redirect targets.
 */
export type AppleOauthRedirectState = {
    nonce: string;
    callback_success_url: SystemUrl;
    callback_failure_url: SystemUrl;
};

