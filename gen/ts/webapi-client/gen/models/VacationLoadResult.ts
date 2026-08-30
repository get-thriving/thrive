/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Contact } from './Contact';
import type { Location } from './Location';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
import type { UserLight } from './UserLight';
import type { Vacation } from './Vacation';
/**
 * VacationLoadResult.
 */
export type VacationLoadResult = {
    vacation: Vacation;
    note?: (Note | null);
    time_event_block: TimeEventFullDaysBlock;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    location?: (Location | null);
    publish_entity?: (PublishEntity | null);
    owner: UserLight;
    access_status?: (AccessStatus | null);
};

