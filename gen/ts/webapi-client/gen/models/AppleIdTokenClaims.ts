/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppleSubjectId } from './AppleSubjectId';
import type { EmailAddress } from './EmailAddress';
/**
 * Profile fields extracted from an Apple ID token payload.
 */
export type AppleIdTokenClaims = {
    sub: AppleSubjectId;
    email: EmailAddress;
    email_verified: boolean;
    is_private_email?: (boolean | null);
};

