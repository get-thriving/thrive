/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessRequest } from './AccessRequest';
import type { EntitySummary } from './EntitySummary';
import type { UserLight } from './UserLight';
/**
 * AccessRequestLoad result.
 */
export type AccessRequestLoadResult = {
    access_request: AccessRequest;
    entity: EntitySummary;
    requester: UserLight;
    owner: UserLight;
    can_accept: boolean;
    can_reject: boolean;
    can_cancel: boolean;
};

