/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EventEntry } from './EventEntry';
import type { User } from './User';
/**
 * Results for the mutation entity events.
 */
export type GetMutationEntityEventsResult = {
    mutation_name: string;
    entries: Array<EventEntry>;
    users: Array<User>;
};

