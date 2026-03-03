/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from './Contact';
import type { Occasion } from './Occasion';
import type { Person } from './Person';
import type { ScheduleEventFullDays } from './ScheduleEventFullDays';
import type { TimeEventFullDaysBlock } from './TimeEventFullDaysBlock';
import type { Vacation } from './Vacation';
/**
 * FullDaysBlockLoadResult.
 */
export type TimeEventFullDaysBlockLoadResult = {
    full_days_block: TimeEventFullDaysBlock;
    schedule_event?: (ScheduleEventFullDays | null);
    person?: (Person | null);
    contact?: (Contact | null);
    occasion?: (Occasion | null);
    vacation?: (Vacation | null);
};

