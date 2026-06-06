/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Aspect } from './Aspect';
import type { Project } from './Project';
import type { ProjectMilestone } from './ProjectMilestone';
import type { ProjectStats } from './ProjectStats';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
/**
 * ProjectLoadResult.
 */
export type ProjectLoadResult = {
    project: Project;
    aspect: Aspect;
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    milestones: Array<ProjectMilestone>;
    inbox_tasks: Array<InboxTask>;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
    stats: ProjectStats;
};

