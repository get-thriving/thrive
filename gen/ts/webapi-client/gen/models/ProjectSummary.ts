/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectName } from './ProjectName';
import type { EntityId } from './EntityId';
/**
 * Summary information about a project.
 */
export type ProjectSummary = {
    ref_id: EntityId;
    name: ProjectName;
    aspect_ref_id: EntityId;
    chapter_ref_id?: (EntityId | null);
    goal_ref_id?: (EntityId | null);
    is_key: boolean;
};

