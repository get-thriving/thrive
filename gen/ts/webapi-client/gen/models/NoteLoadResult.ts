/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Note } from './Note';
import type { UserLight } from './UserLight';
/**
 * NoteLoad result.
 */
export type NoteLoadResult = {
    note: Note;
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

