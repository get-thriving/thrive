/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chapter } from './Chapter';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Project } from './Project';
/**
 * A single entry in the load all habits response.
 */
export type HabitFindResultEntry = {
    habit: Habit;
    project?: (Project | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks?: (Array<InboxTask> | null);
    note?: (Note | null);
};

