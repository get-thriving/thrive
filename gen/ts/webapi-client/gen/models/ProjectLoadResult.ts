/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Aspect } from './Aspect';
import type { Chapter } from './Chapter';
import type { Contact } from './Contact';
import type { Goal } from './Goal';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Project } from './Project';
import type { ProjectMilestone } from './ProjectMilestone';
import type { ProjectStats } from './ProjectStats';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventInDayBlock } from './TimeEventInDayBlock';
import type { UserLight } from './UserLight';
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
    inbox_tasks_total_cnt: number;
    inbox_tasks_page_size: number;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    note?: (Note | null);
    time_event_blocks: Array<TimeEventInDayBlock>;
    stats: ProjectStats;
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

