/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { Chapter } from './Chapter';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { HabitStreakMark } from './HabitStreakMark';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Project } from './Project';
import type { Tag } from './Tag';
/**
 * HabitLoadResult.
 */
export type HabitLoadResult = {
    habit: Habit;
    project: Project;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks: Array<InboxTask>;
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    streak_marks: Array<HabitStreakMark>;
    streak_mark_earliest_date: ADate;
    streak_mark_latest_date: ADate;
    tags: Array<Tag>;
    note?: (Note | null);
};

