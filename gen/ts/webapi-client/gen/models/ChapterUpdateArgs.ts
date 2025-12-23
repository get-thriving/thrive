/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChapterName } from './ChapterName';
import type { EntityId } from './EntityId';
import type { PartialDate } from './PartialDate';
/**
 * Chapter update args.
 */
export type ChapterUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ChapterName;
    };
    start_date: {
        should_change: boolean;
        value?: PartialDate;
    };
    end_date: {
        should_change: boolean;
        value?: PartialDate;
    };
};

