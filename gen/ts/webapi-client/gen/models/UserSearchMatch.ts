/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmailAddress } from './EmailAddress';
import type { EntityId } from './EntityId';
import type { UserName } from './UserName';
/**
 * Summary of a user returned by user search, safe for invite autocomplete.
 */
export type UserSearchMatch = {
    ref_id: EntityId;
    name: UserName;
    email_address: EmailAddress;
};

