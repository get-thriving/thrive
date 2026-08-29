/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
import type { ProjectWorkSummary } from './ProjectWorkSummary';
/**
 * The report for a particular project.
 */
export type PerProjectBreakdownItem = {
    ref_id: EntityId;
    name: EntityName;
    actionable_date?: (ADate | null);
    summary: ProjectWorkSummary;
};

