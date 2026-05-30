/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AspectName } from './AspectName';
import type { Birthday } from './Birthday';
import type { BirthYear } from './BirthYear';
import type { EntityId } from './EntityId';
import type { ScheduleStreamName } from './ScheduleStreamName';
import type { Timezone } from './Timezone';
import type { WorkspaceFeature } from './WorkspaceFeature';
import type { WorkspaceName } from './WorkspaceName';
/**
 * Init create workspace use case arguments.
 */
export type InitCreateWorkspaceArgs = {
    user_id: EntityId;
    timezone: Timezone;
    birthday: Birthday;
    birth_year: BirthYear;
    name: WorkspaceName;
    first_schedule_stream_name: ScheduleStreamName;
    root_aspect_name: AspectName;
    feature_flags: Array<WorkspaceFeature>;
};

