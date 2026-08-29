/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Chore } from './Chore';
import type { EmailTask } from './EmailTask';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { Journal } from './Journal';
import type { Metric } from './Metric';
import type { Occasion } from './Occasion';
import type { Person } from './Person';
import type { Project } from './Project';
import type { SlackTask } from './SlackTask';
import type { TimePlan } from './TimePlan';
import type { TodoTask } from './TodoTask';
import type { UserLight } from './UserLight';
import type { WorkingMemCollection } from './WorkingMemCollection';
/**
 * InboxTaskLoadResult.
 */
export type InboxTaskLoadResult = {
    inbox_task: InboxTask;
    working_mem_collection?: (WorkingMemCollection | null);
    time_plan?: (TimePlan | null);
    habit?: (Habit | null);
    chore?: (Chore | null);
    project?: (Project | null);
    journal?: (Journal | null);
    metric?: (Metric | null);
    person?: (Person | null);
    occasion?: (Occasion | null);
    slack_task?: (SlackTask | null);
    email_task?: (EmailTask | null);
    todo_task?: (TodoTask | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

