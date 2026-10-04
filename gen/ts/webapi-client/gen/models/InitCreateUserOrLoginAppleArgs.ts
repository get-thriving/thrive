/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppleAuthCode } from './AppleAuthCode';
import type { SystemUrl } from './SystemUrl';
/**
 * Init create user or login (Apple auth) use case arguments.
 */
export type InitCreateUserOrLoginAppleArgs = {
    apple_auth_code: AppleAuthCode;
    callback_uri: SystemUrl;
    apple_user_json?: (string | null);
};

