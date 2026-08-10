/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { ScheduleStream } from './ScheduleStream';
import type { Tag } from './Tag';
import type { UserLight } from './UserLight';
/**
 * ScheduleStreamLoadResult.
 */
export type ScheduleStreamLoadResult = {
    schedule_stream: ScheduleStream;
    note?: (Note | null);
    tags: Array<Tag>;
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

