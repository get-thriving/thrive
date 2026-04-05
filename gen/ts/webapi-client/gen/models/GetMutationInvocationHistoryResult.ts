/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvocationHistoryEntry } from './InvocationHistoryEntry';
import type { User } from './User';
/**
 * Results for the mutation invocation history.
 */
export type GetMutationInvocationHistoryResult = {
    entries: Array<InvocationHistoryEntry>;
    users: Array<User>;
    total_cnt: number;
    page_size: number;
};

