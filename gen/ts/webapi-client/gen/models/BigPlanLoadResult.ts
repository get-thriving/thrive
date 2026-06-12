/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { BigPlan } from './BigPlan';
import type { BigPlanMilestone } from './BigPlanMilestone';
import type { BigPlanStats } from './BigPlanStats';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * BigPlanLoadResult.
 */
export type BigPlanLoadResult = {
    big_plan: BigPlan;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    milestones: Array<BigPlanMilestone>;
    inbox_tasks: Array<InboxTask>;
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
    stats: BigPlanStats;
    publish_entity?: (PublishEntity | null);
};

