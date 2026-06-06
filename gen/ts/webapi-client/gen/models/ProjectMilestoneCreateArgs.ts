/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { EntityId } from './EntityId';
import type { EntityName } from './EntityName';
/**
 * Project milestone create args.
 */
export type ProjectMilestoneCreateArgs = {
    project_ref_id: EntityId;
    date: ADate;
    name: EntityName;
};

