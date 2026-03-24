/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BigPlanEntry } from './BigPlanEntry';
import type { ChoreEntry } from './ChoreEntry';
import type { HabitEntry } from './HabitEntry';
import type { PersonOccasionEntry } from './PersonOccasionEntry';
import type { ScheduleFullDaysEventEntry } from './ScheduleFullDaysEventEntry';
import type { ScheduleInDayEventEntry } from './ScheduleInDayEventEntry';
import type { TimePlanActivityEntry } from './TimePlanActivityEntry';
import type { TodoTaskEntry } from './TodoTaskEntry';
import type { VacationEntry } from './VacationEntry';
/**
 * Full entries for results.
 */
export type CalendarEventsEntries = {
    schedule_event_full_days_entries: Array<ScheduleFullDaysEventEntry>;
    schedule_event_in_day_entries: Array<ScheduleInDayEventEntry>;
    big_plan_entries: Array<BigPlanEntry>;
    todo_task_entries: Array<TodoTaskEntry>;
    habit_entries: Array<HabitEntry>;
    chore_entries: Array<ChoreEntry>;
    time_plan_activity_entries: Array<TimePlanActivityEntry>;
    person_occasion_entries: Array<PersonOccasionEntry>;
    vacation_entries: Array<VacationEntry>;
};

