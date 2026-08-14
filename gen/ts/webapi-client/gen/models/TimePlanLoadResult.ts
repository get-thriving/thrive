/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Aspect } from './Aspect';
import type { BigPlan } from './BigPlan';
import type { BigPlanStats } from './BigPlanStats';
import type { Chapter } from './Chapter';
import type { Chore } from './Chore';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlan } from './TimePlan';
import type { TimePlanActivity } from './TimePlanActivity';
import type { TimePlanActivityDoneness } from './TimePlanActivityDoneness';
import type { TodoTask } from './TodoTask';
import type { UserLight } from './UserLight';
/**
 * TimePlanLoadResult.
 */
export type TimePlanLoadResult = {
    time_plan: TimePlan;
    tags: Array<Tag>;
    note: Note;
    activities: Array<TimePlanActivity>;
    activity_time_event_blocks: Array<TimeEventInDayBlock>;
    chapters: Array<Chapter>;
    aspects: Array<Aspect>;
    goals: Array<Goal>;
    target_inbox_tasks?: (Array<InboxTask> | null);
    target_big_plans?: (Array<BigPlan> | null);
    big_plan_stats?: (Array<BigPlanStats> | null);
    target_todo_tasks?: (Array<TodoTask> | null);
    target_habits?: (Array<Habit> | null);
    target_chores?: (Array<Chore> | null);
    activity_doneness?: (Record<string, TimePlanActivityDoneness> | null);
    completed_nontarget_inbox_tasks?: (Array<InboxTask> | null);
    completed_nottarget_big_plans?: (Array<BigPlan> | null);
    sub_period_time_plans?: (Array<TimePlan> | null);
    higher_time_plan?: (TimePlan | null);
    previous_time_plan?: (TimePlan | null);
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

