/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Achieved time and effort summary.
 */
export type AchievedTimeAndEffortSummary = {
    total_activities_by_doneness: Record<string, number>;
    activities_by_feasability_by_doneness: Record<string, Record<string, number>>;
    total_score_by_doneness: Record<string, number>;
    score_by_feasability_by_doneness: Record<string, Record<string, number>>;
    total_hours: number;
    hours_by_feasability: Record<string, number>;
};

