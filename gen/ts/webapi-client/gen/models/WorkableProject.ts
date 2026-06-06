/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { ProjectName } from './ProjectName';
import type { EntityId } from './EntityId';
/**
 * The view of a project via a workable.
 */
export type WorkableProject = {
    ref_id: EntityId;
    name: ProjectName;
    actionable_date?: (ADate | null);
};

