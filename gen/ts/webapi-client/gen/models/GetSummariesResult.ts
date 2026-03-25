/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AspectSummary } from './AspectSummary';
import type { BigPlanSummary } from './BigPlanSummary';
import type { ChapterSummary } from './ChapterSummary';
import type { ChoreSummary } from './ChoreSummary';
import type { GoalSummary } from './GoalSummary';
import type { HabitSummary } from './HabitSummary';
import type { JournalSummary } from './JournalSummary';
import type { LifePlan } from './LifePlan';
import type { MetricSummary } from './MetricSummary';
import type { MilestoneSummary } from './MilestoneSummary';
import type { PersonSummary } from './PersonSummary';
import type { ScheduleStreamSummary } from './ScheduleStreamSummary';
import type { SmartListSummary } from './SmartListSummary';
import type { TodoTaskSummary } from './TodoTaskSummary';
import type { User } from './User';
import type { VacationSummary } from './VacationSummary';
import type { Vision } from './Vision';
import type { Workspace } from './Workspace';
/**
 * Get summaries result.
 */
export type GetSummariesResult = {
    user?: (User | null);
    workspace?: (Workspace | null);
    life_plan?: (LifePlan | null);
    active_vision?: (Vision | null);
    vacations?: (Array<VacationSummary> | null);
    schedule_streams?: (Array<ScheduleStreamSummary> | null);
    root_aspect?: (AspectSummary | null);
    aspects?: (Array<AspectSummary> | null);
    chapters?: (Array<ChapterSummary> | null);
    goals?: (Array<GoalSummary> | null);
    milestones?: (Array<MilestoneSummary> | null);
    todo_tasks?: (Array<TodoTaskSummary> | null);
    journals_last_year?: (Array<JournalSummary> | null);
    habits?: (Array<HabitSummary> | null);
    chores?: (Array<ChoreSummary> | null);
    big_plans?: (Array<BigPlanSummary> | null);
    smart_lists?: (Array<SmartListSummary> | null);
    metrics?: (Array<MetricSummary> | null);
    persons?: (Array<PersonSummary> | null);
};

