/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Person } from './Person';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
/**
 * A single person result.
 */
export type PersonFindResultEntry = {
    person: Person;
    circle_ref_ids: Array<EntityId>;
    note?: (Note | null);
    birthday_time_event_blocks?: (Array<TimeEventFullDaysBlock> | null);
    catch_up_inbox_tasks?: (Array<InboxTask> | null);
    birthday_inbox_tasks?: (Array<InboxTask> | null);
};

