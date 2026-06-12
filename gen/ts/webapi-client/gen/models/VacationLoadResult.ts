/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Note } from './Note';
import type { PublishEntity } from './PublishEntity';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
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
    publish_entity?: (PublishEntity | null);
};

