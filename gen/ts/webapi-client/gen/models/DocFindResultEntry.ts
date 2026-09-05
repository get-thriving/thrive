/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Doc } from './Doc';
import type { Location } from './Location';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * A single entry in the load all docs response.
 */
export type DocFindResultEntry = {
    doc: Doc;
    tags: Array<Tag>;
    location?: (Location | null);
    note?: (Note | null);
    owner: UserLight;
    access_status: AccessStatus;
};

