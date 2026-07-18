/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessLevel } from './AccessLevel';
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { EntityName } from './EntityName';
import type { PrincipalType } from './PrincipalType';
import type { Timestamp } from './Timestamp';
/**
 * A grant of access to a resource for a principal.
 */
export type AccessGrant = {
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
};

