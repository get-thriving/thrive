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
import type { Tag } from './Tag';
/**
 * A single big plan result.
 */
export type BigPlanFindResultEntry = {
    big_plan: BigPlan;
    note?: (Note | null);
    milestones?: (Array<BigPlanMilestone> | null);
    stats?: (BigPlanStats | null);
    project?: (Project | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks?: (Array<InboxTask> | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
};

