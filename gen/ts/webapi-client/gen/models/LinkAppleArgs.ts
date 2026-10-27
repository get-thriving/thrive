/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppleAuthCode } from './AppleAuthCode';
import type { SystemUrl } from './SystemUrl';
/**
 * Link (Apple auth) arguments.
 */
export type LinkAppleArgs = {
    apple_auth_code: AppleAuthCode;
    callback_uri: SystemUrl;
    apple_user_json?: (string | null);
};

