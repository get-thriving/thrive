/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessGrant } from './AccessGrant';
import type { AccessInvite } from './AccessInvite';
import type { EntitySummary } from './EntitySummary';
import type { UserLight } from './UserLight';
/**
 * One unacknowledged access invite for the current user.
 */
export type CollaborationInviteEntry = {
    entity: EntitySummary;
    access_invite: AccessInvite;
    access_grant: AccessGrant;
    subject: UserLight;
};

