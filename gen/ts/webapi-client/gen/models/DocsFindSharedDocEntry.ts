/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Doc } from './Doc';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * A doc shared directly with the current user.
 */
export type DocsFindSharedDocEntry = {
    doc: Doc;
    note?: (Note | null);
    tags: Array<Tag>;
    owner: UserLight;
    access_status: AccessStatus;
};

