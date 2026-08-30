/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessStatus } from './AccessStatus';
import type { Contact } from './Contact';
import type { Location } from './Location';
import type { Note } from './Note';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
import type { UserLight } from './UserLight';
import type { Vacation } from './Vacation';
/**
 * PersonFindResult object.
 */
export type VacationFindResultEntry = {
    vacation: Vacation;
    tags: Array<Tag>;
    contacts: Array<Contact>;
    locations: Array<Location>;
    note?: (Note | null);
    time_event_block?: (TimeEventFullDaysBlock | null);
    owner: UserLight;
    access_status: AccessStatus;
};

