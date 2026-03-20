/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { BigPlan } from './BigPlan';
import type { Chapter } from './Chapter';
import type { Chore } from './Chore';
import type { Contact } from './Contact';
import type { EmailTask } from './EmailTask';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { InboxTask } from './InboxTask';
import type { Journal } from './Journal';
import type { Metric } from './Metric';
import type { Note } from './Note';
import type { Occasion } from './Occasion';
import type { Person } from './Person';
import type { SlackTask } from './SlackTask';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlan } from './TimePlan';
import type { TodoTask } from './TodoTask';
import type { WorkingMemCollection } from './WorkingMemCollection';
/**
 * A single entry in the load all inbox tasks response.
 */
export type InboxTaskFindResultEntry = {
    inbox_task: InboxTask;
    contacts: Array<Contact>;
    note?: (Note | null);
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    time_event_blocks?: (Array<TimeEventInDayBlock> | null);
    working_mem_collection?: (WorkingMemCollection | null);
    time_plan?: (TimePlan | null);
    habit?: (Habit | null);
    chore?: (Chore | null);
    big_plan?: (BigPlan | null);
    journal?: (Journal | null);
    metric?: (Metric | null);
    person?: (Person | null);
    contact?: (Contact | null);
    occasion?: (Occasion | null);
    slack_task?: (SlackTask | null);
    email_task?: (EmailTask | null);
    todo_task?: (TodoTask | null);
};

