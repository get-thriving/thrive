/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
import type { Vacation } from './Vacation';
/**
 * PersonFindResult object.
 */
export type VacationFindResultEntry = {
    vacation: Vacation;
    tags: Array<Tag>;
    note?: (Note | null);
    time_event_block?: (TimeEventFullDaysBlock | null);
};

