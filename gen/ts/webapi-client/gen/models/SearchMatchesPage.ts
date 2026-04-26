/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchMatch } from './SearchMatch';
/**
 * One page of search hits plus the total number of matching entities.
 */
export type SearchMatchesPage = {
    matches: Array<SearchMatch>;
    total_match_count: number;
};

