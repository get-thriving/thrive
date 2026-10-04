/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemUrl } from './SystemUrl';
/**
 * Arguments for building an Apple OAuth authorisation URL.
 */
export type AuthAppleGetAuthorisationUrlArgs = {
    ready_url: SystemUrl;
    callback_success_url: SystemUrl;
    callback_failure_url: SystemUrl;
};

