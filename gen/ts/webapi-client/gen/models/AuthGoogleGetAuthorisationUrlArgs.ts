/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemUrl } from './SystemUrl';
/**
 * Arguments for building a Google OAuth authorisation URL.
 */
export type AuthGoogleGetAuthorisationUrlArgs = {
    ready_url: SystemUrl;
    callback_success_url: SystemUrl;
    callback_failure_url: SystemUrl;
};

