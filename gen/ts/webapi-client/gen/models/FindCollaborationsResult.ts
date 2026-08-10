/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CollaborationEntry } from './CollaborationEntry';
import type { CollaborationInviteEntry } from './CollaborationInviteEntry';
import type { CollaborationRequestEntry } from './CollaborationRequestEntry';
import type { UserLight } from './UserLight';
/**
 * Collaboration lists for the current user.
 */
export type FindCollaborationsResult = {
    invites: Array<CollaborationInviteEntry>;
    shared_with_me: Array<CollaborationEntry>;
    shared_by_me: Array<CollaborationEntry>;
    incoming_requests: Array<CollaborationRequestEntry>;
    outgoing_requests: Array<CollaborationRequestEntry>;
    users: Array<UserLight>;
};

