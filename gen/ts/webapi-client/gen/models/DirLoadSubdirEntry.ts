/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Dir } from './Dir';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * One subdirectory row (tags only; no note body).
 */
export type DirLoadSubdirEntry = {
    dir: Dir;
    tags: Array<Tag>;
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

