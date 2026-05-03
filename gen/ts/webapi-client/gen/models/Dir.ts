/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirName } from './DirName';
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A directory in the doc collection.
 */
export type Dir = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: DirName;
    doc_collection_ref_id: string;
    parent_dir_ref_id?: (EntityId | null);
};

