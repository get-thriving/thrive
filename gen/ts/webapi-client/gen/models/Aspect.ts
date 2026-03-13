/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AspectName } from './AspectName';
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * The aspect.
 */
export type Aspect = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    name: AspectName;
    life_plan_ref_id: string;
    parent_aspect_ref_id?: (EntityId | null);
    order_of_child_aspects: Array<EntityId>;
};

