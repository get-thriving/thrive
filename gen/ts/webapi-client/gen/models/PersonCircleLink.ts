/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { Timestamp } from './Timestamp';
/**
 * A link between a person and a circle.
 */
export type PersonCircleLink = {
    created_time: Timestamp;
    last_modified_time: Timestamp;
    prm_ref_id: string;
    person_ref_id: EntityId;
    circle_ref_id: EntityId;
};

