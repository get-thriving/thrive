/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlan } from './BigPlan';
import type { BigPlanLoadResult } from './BigPlanLoadResult';
import type { Chore } from './Chore';
import type { ChoreLoadResult } from './ChoreLoadResult';
import type { Habit } from './Habit';
import type { HabitLoadResult } from './HabitLoadResult';
import type { InboxTask } from './InboxTask';
import type { InboxTaskLoadResult } from './InboxTaskLoadResult';
import type { Note } from './Note';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlanActivity } from './TimePlanActivity';
import type { TodoTask } from './TodoTask';
import type { TodoTaskLoadResult } from './TodoTaskLoadResult';
/**
 * TimePlanActivityLoadResult.
 */
export type TimePlanActivityLoadResult = {
    time_plan_activity: TimePlanActivity;
    target_inbox_task?: (InboxTask | null);
    target_inbox_task_info?: (InboxTaskLoadResult | null);
    target_big_plan?: (BigPlan | null);
    target_big_plan_info?: (BigPlanLoadResult | null);
    target_todo_task?: (TodoTask | null);
    target_todo_task_info?: (TodoTaskLoadResult | null);
    target_habit?: (Habit | null);
    target_habit_info?: (HabitLoadResult | null);
    target_chore?: (Chore | null);
    target_chore_info?: (ChoreLoadResult | null);
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
};

