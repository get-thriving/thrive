/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessLevel } from './AccessLevel';
import type { AccessRequestStatus } from './AccessRequestStatus';
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { EntityName } from './EntityName';
import type { PrincipalType } from './PrincipalType';
import type { Timestamp } from './Timestamp';
/**
 * A request for access to a resource by a principal.
 */
export type AccessRequest = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    access_domain_ref_id: string;
    entity: EntityLink;
    principal: PrincipalType;
    user_ref_id: EntityId;
    access_level: AccessLevel;
    status: AccessRequestStatus;
};

