/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchLimit } from './SearchLimit';
import type { SearchQuery } from './SearchQuery';
/**
 * LocationSearch args.
 */
export type LocationSearchArgs = {
    query: SearchQuery;
    limit?: (SearchLimit | null);
    include_archived?: (boolean | null);
    include_candidates?: (boolean | null);
};

