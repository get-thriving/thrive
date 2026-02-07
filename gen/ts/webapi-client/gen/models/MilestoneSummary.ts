/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { MilestoneName } from './MilestoneName';
/**
 * Summary information about a milestone.
 */
export type MilestoneSummary = {
    ref_id: EntityId;
    name: MilestoneName;
    date: ADate;
    project_ref_id: EntityId;
};

