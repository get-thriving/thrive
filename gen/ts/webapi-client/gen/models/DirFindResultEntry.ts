/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Dir } from './Dir';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * One directory row in the find-all response.
 */
export type DirFindResultEntry = {
    dir: Dir;
    tags: Array<Tag>;
    owner: UserLight;
    access_status: AccessStatus;
};

