/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { VerificationCodePlain } from './VerificationCodePlain';
/**
 * Verify email verification attempt args.
 */
export type VerifyEmailVerificationAttemptArgs = {
    user_id: EntityId;
    code: VerificationCodePlain;
};

