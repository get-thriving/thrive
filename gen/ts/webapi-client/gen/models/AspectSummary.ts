/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AspectName } from './AspectName';
import type { EntityId } from './EntityId';
/**
 * Summary information about a aspect.
 */
export type AspectSummary = {
    ref_id: EntityId;
    parent_aspect_ref_id?: (EntityId | null);
    name: AspectName;
    order_of_child_aspects: Array<EntityId>;
};

