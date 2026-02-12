/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Doc } from './Doc';
import type { Note } from './Note';
import type { Tag } from './Tag';
/**
 * A single entry in the load all docs response.
 */
export type DocFindResultEntry = {
    doc: Doc;
    tags: Array<Tag>;
    note?: (Note | null);
    subdocs?: (Array<Doc> | null);
};

