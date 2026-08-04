/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessLevel } from './AccessLevel';
import type { EntityId } from './EntityId';
import type { NamedEntityTag } from './NamedEntityTag';
/**
 * UpdateGrantForEntity args.
 */
export type UpdateGrantForEntityArgs = {
    entity_type: NamedEntityTag;
    entity_ref_id: EntityId;
    access_grant_ref_id: EntityId;
    access_level: AccessLevel;
};

