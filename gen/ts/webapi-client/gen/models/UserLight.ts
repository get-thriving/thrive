/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAddress } from './EmailAddress';
import type { EntityId } from './EntityId';
import type { UserName } from './UserName';
/**
 * A user's ref id, name, and email address.
 */
export type UserLight = {
    ref_id: EntityId;
    name: UserName;
    email_address: EmailAddress;
};

