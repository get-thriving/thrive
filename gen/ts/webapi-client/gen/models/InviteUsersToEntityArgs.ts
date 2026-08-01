/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessLevel } from './AccessLevel';
import type { EntityId } from './EntityId';
import type { NamedEntityTag } from './NamedEntityTag';
/**
 * InviteUsersToEntity args.
 */
export type InviteUsersToEntityArgs = {
    entity_type: NamedEntityTag;
    entity_ref_id: EntityId;
    user_ref_ids: Array<EntityId>;
    access_level: AccessLevel;
};

