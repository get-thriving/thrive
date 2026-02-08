/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Chapter } from './Chapter';
import type { Chore } from './Chore';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Project } from './Project';
import type { Tag } from './Tag';
/**
 * ChoreLoadResult.
 */
export type ChoreLoadResult = {
    chore: Chore;
    project: Project;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks: Array<InboxTask>;
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    tags: Array<Tag>;
    note?: (Note | null);
};

