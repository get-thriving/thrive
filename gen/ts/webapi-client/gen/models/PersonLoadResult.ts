/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { EntityId } from './EntityId';
import type { InboxTask } from './InboxTask';
import type { Note } from './Note';
import type { Occasion } from './Occasion';
import type { Person } from './Person';
import type { Tag } from './Tag';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
/**
 * PersonLoadResult.
 */
export type PersonLoadResult = {
    person: Person;
    contact: Contact;
    circle_ref_ids: Array<EntityId>;
    occasions: Array<Occasion>;
    occasion_tags_by_ref_id: Record<string, Array<Tag>>;
    occasion_time_event_blocks: Array<TimeEventFullDaysBlock>;
    catch_up_tasks: Array<InboxTask>;
    catch_up_tasks_total_cnt: number;
    catch_up_tasks_page_size: number;
    occasion_tasks: Array<InboxTask>;
    occasion_tasks_total_cnt: number;
    occasion_tasks_page_size: number;
    tags: Array<Tag>;
    note?: (Note | null);
};

