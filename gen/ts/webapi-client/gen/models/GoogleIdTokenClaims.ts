/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAddress } from './EmailAddress';
import type { GoogleSubjectId } from './GoogleSubjectId';
/**
 * Profile fields extracted from a Google ID token payload.
 */
export type GoogleIdTokenClaims = {
    sub: GoogleSubjectId;
    email: EmailAddress;
    name?: (string | null);
};

