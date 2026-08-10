/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessRequest } from './AccessRequest';
import type { EntitySummary } from './EntitySummary';
import type { UserLight } from './UserLight';
/**
 * One access request involving the current user.
 */
export type CollaborationRequestEntry = {
    entity: EntitySummary;
    access_request: AccessRequest;
    subject: UserLight;
};

