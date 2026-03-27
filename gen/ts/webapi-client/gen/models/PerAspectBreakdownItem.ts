/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { WorkableSummary } from './WorkableSummary';
/**
 * The report for a particular aspect.
 */
export type PerAspectBreakdownItem = {
    ref_id: EntityId;
    name: EntityName;
    big_plans_summary: WorkableSummary;
};

