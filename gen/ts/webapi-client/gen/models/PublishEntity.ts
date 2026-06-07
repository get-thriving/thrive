/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityLink } from './EntityLink';
import type { PublishEntityName } from './PublishEntityName';
import type { PublishEntityStatus } from './PublishEntityStatus';
import type { PublishExternalId } from './PublishExternalId';
import type { Timestamp } from './Timestamp';
/**
 * A publish entity.
 */
export type PublishEntity = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: PublishEntityName;
    publish_domain_ref_id: string;
    owner: EntityLink;
    external_id: PublishExternalId;
    status: PublishEntityStatus;
};

