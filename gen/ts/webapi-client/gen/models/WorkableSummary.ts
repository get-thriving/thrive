/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WorkableProject } from './WorkableProject';
/**
 * The reporting summary.
 */
export type WorkableSummary = {
    created_cnt: number;
    not_started_cnt: number;
    working_cnt: number;
    not_done_cnt: number;
    done_cnt: number;
    not_done_projects: Array<WorkableProject>;
    done_projects: Array<WorkableProject>;
};

