/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChapterName } from './ChapterName';
import type { EntityId } from './EntityId';
import type { PartialDate } from './PartialDate';
import type { Timestamp } from './Timestamp';
/**
 * A chapter in a life plan.
 */
export type Chapter = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: ChapterName;
    life_plan_ref_id: string;
    aspect_ref_id: EntityId;
    start_date: PartialDate;
    end_date: PartialDate;
};

