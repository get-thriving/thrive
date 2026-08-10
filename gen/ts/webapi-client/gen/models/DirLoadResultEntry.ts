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
 * One doc in the loaded directory.
 */
export type DirLoadResultEntry = {
    doc: Doc;
    tags: Array<Tag>;
    note: Note;
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

