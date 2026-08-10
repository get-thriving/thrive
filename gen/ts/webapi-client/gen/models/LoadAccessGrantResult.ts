/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessGrant } from './AccessGrant';
import type { EntitySummary } from './EntitySummary';
import type { UserLight } from './UserLight';
/**
 * LoadAccessGrant result.
 */
export type LoadAccessGrantResult = {
    access_grant: AccessGrant;
    entity: EntitySummary;
    owner: UserLight;
    grantee: UserLight;
    can_update: boolean;
    can_revoke: boolean;
    can_forget: boolean;
};

