/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Doc } from './Doc';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
/**
 * DocLoad result.
 */
export type DocLoadResult = {
    doc: Doc;
    note: Note;
    tags: Array<Tag>;
    publish_entity?: (PublishEntity | null);
};

