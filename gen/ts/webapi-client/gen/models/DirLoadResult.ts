/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Dir } from './Dir';
import type { DirLoadResultEntry } from './DirLoadResultEntry';
import type { DirLoadSubdirEntry } from './DirLoadSubdirEntry';
/**
 * Loaded directory, its docs, and immediate child directories.
 */
export type DirLoadResult = {
    dir: Dir;
    entries: Array<DirLoadResultEntry>;
    subdirs: Array<DirLoadSubdirEntry>;
};

