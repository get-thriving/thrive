/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessGrant } from './AccessGrant';
import type { EntitySummary } from './EntitySummary';
import type { UserLight } from './UserLight';
/**
 * One shared entity and the other person involved in the grant.
 */
export type CollaborationEntry = {
    entity: EntitySummary;
    access_grant: AccessGrant;
    subject: UserLight;
};

