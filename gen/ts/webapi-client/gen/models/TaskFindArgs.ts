/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TaskNamespace } from './TaskNamespace';
/**
 * TaskFind args.
 */
export type TaskFindArgs = {
    allow_archived?: (boolean | null);
    filter_namespace?: (Array<TaskNamespace> | null);
    filter_ref_ids?: (Array<EntityId> | null);
};

