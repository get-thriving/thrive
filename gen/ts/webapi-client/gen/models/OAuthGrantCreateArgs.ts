/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OAuthClientId } from './OAuthClientId';
import type { OAuthResource } from './OAuthResource';
import type { PkceCodeChallenge } from './PkceCodeChallenge';
import type { PkceCodeChallengeMethod } from './PkceCodeChallengeMethod';
import type { SystemUrl } from './SystemUrl';
/**
 * OAuth grant create args.
 */
export type OAuthGrantCreateArgs = {
    client_id: OAuthClientId;
    redirect_uri: SystemUrl;
    resource: OAuthResource;
    code_challenge: PkceCodeChallenge;
    code_challenge_method: PkceCodeChallengeMethod;
};

