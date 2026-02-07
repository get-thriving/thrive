/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChapterName } from './ChapterName';
import type { EntityId } from './EntityId';
import type { PartialDate } from './PartialDate';
/**
 * Summary information about a chapter.
 */
export type ChapterSummary = {
    ref_id: EntityId;
    name: ChapterName;
    start_date: PartialDate;
    end_date: PartialDate;
    project_ref_id: EntityId;
};

