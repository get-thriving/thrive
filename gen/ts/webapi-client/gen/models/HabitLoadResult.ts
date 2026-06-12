/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ADate } from './ADate';
import type { Aspect } from './Aspect';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { Habit } from './Habit';
import type { HabitStreakMark } from './HabitStreakMark';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * HabitLoadResult.
 */
export type HabitLoadResult = {
    habit: Habit;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks: Array<InboxTask>;
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    streak_marks: Array<HabitStreakMark>;
    streak_mark_earliest_date: ADate;
    streak_mark_latest_date: ADate;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
    publish_entity?: (PublishEntity | null);
};

