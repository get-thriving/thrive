/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessLevel } from './AccessLevel';
import type { AccessStatusReason } from './AccessStatusReason';
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { Timestamp } from './Timestamp';
/**
 * The effective access status of a principal over a resource.
 */
export type AccessStatus = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    access_domain_ref_id: string;
    entity: EntityLink;
    user_ref_id: EntityId;
    access_level: AccessLevel;
    reason: AccessStatusReason;
    access_grant_ref_id: EntityId;
};

