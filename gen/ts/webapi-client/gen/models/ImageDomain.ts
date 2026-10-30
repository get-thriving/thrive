/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * The singleton images domain, for the images of users and workspaces alike.
 */
export type ImageDomain = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
};

