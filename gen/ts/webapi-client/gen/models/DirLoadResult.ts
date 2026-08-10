/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Dir } from './Dir';
import type { DirLoadResultEntry } from './DirLoadResultEntry';
import type { DirLoadSubdirEntry } from './DirLoadSubdirEntry';
import type { PublishEntity } from './PublishEntity';
import type { UserLight } from './UserLight';
/**
 * Loaded directory, its docs, and immediate child directories.
 */
export type DirLoadResult = {
    dir: Dir;
    entries: Array<DirLoadResultEntry>;
    subdirs: Array<DirLoadSubdirEntry>;
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
    parent_dir?: (Dir | null);
    parent_dir_access_status?: (AccessStatus | null);
};

