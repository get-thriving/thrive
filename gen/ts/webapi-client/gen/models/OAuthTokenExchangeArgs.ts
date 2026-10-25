/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthClientId } from './OAuthClientId';
import type { OAuthCodeExternal } from './OAuthCodeExternal';
import type { OAuthResource } from './OAuthResource';
import type { PkceCodeVerifier } from './PkceCodeVerifier';
import type { SystemUrl } from './SystemUrl';
/**
 * OAuth token exchange args.
 */
export type OAuthTokenExchangeArgs = {
    code: OAuthCodeExternal;
    code_verifier: PkceCodeVerifier;
    client_id: OAuthClientId;
    redirect_uri: SystemUrl;
    resource: OAuthResource;
};

