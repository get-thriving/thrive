/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The method a PKCE code challenge was made with.
 *
 * Only S256, the SHA-256 form, is supported. The plain method, where the challenge
 * is the verifier itself, gives no protection against an intercepted code.
 *
 */
export enum PkceCodeChallengeMethod {
    S256 = 'S256',
}
