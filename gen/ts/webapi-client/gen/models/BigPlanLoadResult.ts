/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlan } from './BigPlan';
import type { BigPlanMilestone } from './BigPlanMilestone';
import type { BigPlanStats } from './BigPlanStats';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Project } from './Project';
import type { SuggestedDate } from './SuggestedDate';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * BigPlanLoadResult.
 */
export type BigPlanLoadResult = {
    big_plan: BigPlan;
    project: Project;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    milestones: Array<BigPlanMilestone>;
    inbox_tasks: Array<InboxTask>;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
    stats: BigPlanStats;
    actionable_date_suggested_dates: Array<SuggestedDate>;
    due_date_suggested_dates: Array<SuggestedDate>;
};

