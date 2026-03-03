/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactName } from './ContactName';
import type { EntityId } from './EntityId';
/**
 * ContactUpdate args.
 */
export type ContactUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: ContactName;
    };
};

