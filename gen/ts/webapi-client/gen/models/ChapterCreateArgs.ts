/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChapterName } from './ChapterName';
import type { EntityId } from './EntityId';
import type { PartialDate } from './PartialDate';
/**
 * Chapter create args.
 */
export type ChapterCreateArgs = {
    name: ChapterName;
    aspect_ref_id: EntityId;
    start_date: PartialDate;
    end_date: PartialDate;
};

