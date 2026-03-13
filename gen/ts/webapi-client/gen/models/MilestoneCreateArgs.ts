/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { MilestoneName } from './MilestoneName';
/**
 * Milestone create args.
 */
export type MilestoneCreateArgs = {
    name: MilestoneName;
    date: ADate;
    aspect_ref_id: EntityId;
};

