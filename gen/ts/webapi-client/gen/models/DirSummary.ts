/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirName } from './DirName';
import type { EntityId } from './EntityId';
/**
 * Summary information about the docs root directory.
 */
export type DirSummary = {
    ref_id: EntityId;
    parent_dir_ref_id?: (EntityId | null);
    name: DirName;
};

