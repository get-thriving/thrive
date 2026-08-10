/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Doc } from './Doc';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * DocLoad result.
 */
export type DocLoadResult = {
    doc: Doc;
    note: Note;
    tags: Array<Tag>;
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

