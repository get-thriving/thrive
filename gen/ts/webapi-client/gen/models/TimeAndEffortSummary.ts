/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievedTimeAndEffortSummary } from './AchievedTimeAndEffortSummary';
import type { PlannedTimeAndEffortSummary } from './PlannedTimeAndEffortSummary';
/**
 * Time and effort summary for a time plan.
 */
export type TimeAndEffortSummary = {
    planned: PlannedTimeAndEffortSummary;
    achieved: AchievedTimeAndEffortSummary;
};

