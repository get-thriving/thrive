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
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * A single project result.
 */
export type ProjectFindResultEntry = {
    project: Project;
    note?: (Note | null);
    milestones?: (Array<ProjectMilestone> | null);
    stats?: (ProjectStats | null);
    aspect?: (Aspect | null);
    chapter?: (Chapter | null);
    goal?: (Goal | null);
    inbox_tasks?: (Array<InboxTask> | null);
    tags: Array<Tag>;
    contacts: Array<Contact>;
    owner: UserLight;
    access_status: AccessStatus;
};

