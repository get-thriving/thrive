/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirName } from './DirName';
import type { EntityId } from './EntityId';
/**
 * DirUpdate args.
 */
export type DirUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: DirName;
    };
    parent_dir_ref_id: {
        should_change: boolean;
        value?: EntityId;
    };
};

