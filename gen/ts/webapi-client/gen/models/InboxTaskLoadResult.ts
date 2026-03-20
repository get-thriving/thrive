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
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { TimePlan } from './TimePlan';
import type { TodoTask } from './TodoTask';
import type { WorkingMemCollection } from './WorkingMemCollection';
/**
 * InboxTaskLoadResult.
 */
export type InboxTaskLoadResult = {
    inbox_task: InboxTask;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    working_mem_collection?: (WorkingMemCollection | null);
    time_plan?: (TimePlan | null);
    habit?: (Habit | null);
    chore?: (Chore | null);
    big_plan?: (BigPlan | null);
    journal?: (Journal | null);
    metric?: (Metric | null);
    person?: (Person | null);
    occasion?: (Occasion | null);
    slack_task?: (SlackTask | null);
    email_task?: (EmailTask | null);
    todo_task?: (TodoTask | null);
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
};

