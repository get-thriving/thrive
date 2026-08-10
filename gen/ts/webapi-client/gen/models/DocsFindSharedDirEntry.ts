/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Dir } from './Dir';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * A directory shared directly with the current user.
 */
export type DocsFindSharedDirEntry = {
    dir: Dir;
    tags: Array<Tag>;
    owner: UserLight;
    access_status: AccessStatus;
};

