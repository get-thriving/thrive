/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { Timestamp } from './Timestamp';
/**
 * An unacknowledged invite pointing at an access grant.
 */
export type AccessInvite = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: EntityName;
    access_domain_ref_id: string;
    access_grant_ref_id: EntityId;
};

