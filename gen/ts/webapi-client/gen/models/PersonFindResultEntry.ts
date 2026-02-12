/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Occasion } from './Occasion';
import type { Person } from './Person';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
/**
 * A single person result.
 */
export type PersonFindResultEntry = {
    person: Person;
    occasions: Array<Occasion>;
    circle_ref_ids: Array<EntityId>;
    tags: Array<Tag>;
    note?: (Note | null);
    occasion_time_event_blocks?: (Array<TimeEventFullDaysBlock> | null);
    catch_up_inbox_tasks?: (Array<InboxTask> | null);
    occasion_inbox_tasks?: (Array<InboxTask> | null);
};

