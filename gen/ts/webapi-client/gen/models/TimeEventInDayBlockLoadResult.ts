/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlan } from './BigPlan';
import type { Chore } from './Chore';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { ScheduleEventInDay } from './ScheduleEventInDay';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlanActivity } from './TimePlanActivity';
import type { TodoTask } from './TodoTask';
/**
 * InDayBlockLoadResult.
 */
export type TimeEventInDayBlockLoadResult = {
    in_day_block: TimeEventInDayBlock;
    schedule_event?: (ScheduleEventInDay | null);
    inbox_task?: (InboxTask | null);
    big_plan?: (BigPlan | null);
    todo_task?: (TodoTask | null);
    habit?: (Habit | null);
    chore?: (Chore | null);
    time_plan_activity?: (TimePlanActivity | null);
};

