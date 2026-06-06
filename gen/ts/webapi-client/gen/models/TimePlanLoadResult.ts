/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Project } from './Project';
import type { Chapter } from './Chapter';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TimePlan } from './TimePlan';
import type { TimePlanActivity } from './TimePlanActivity';
import type { TimePlanActivityDoneness } from './TimePlanActivityDoneness';
/**
 * Result.
 */
export type TimePlanLoadResult = {
    time_plan: TimePlan;
    tags: Array<Tag>;
    note: Note;
    activities: Array<TimePlanActivity>;
    chapters: Array<Chapter>;
    aspects: Array<Aspect>;
    goals: Array<Goal>;
    target_inbox_tasks?: (Array<InboxTask> | null);
    target_projects?: (Array<Project> | null);
    activity_doneness?: (Record<string, TimePlanActivityDoneness> | null);
    completed_nontarget_inbox_tasks?: (Array<InboxTask> | null);
    completed_nottarget_projects?: (Array<Project> | null);
    sub_period_time_plans?: (Array<TimePlan> | null);
    higher_time_plan?: (TimePlan | null);
    previous_time_plan?: (TimePlan | null);
};

