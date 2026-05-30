/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoogleAuthCode } from './GoogleAuthCode';
import type { SystemUrl } from './SystemUrl';
/**
 * Init create user or login (Google auth) use case arguments.
 */
export type InitCreateUserOrLoginGoogleArgs = {
    google_auth_code: GoogleAuthCode;
    callback_uri: SystemUrl;
};

