/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Difficulty } from './Difficulty';
import type { Eisen } from './Eisen';
import type { EntityId } from './EntityId';
import type { PersonName } from './PersonName';
import type { RecurringTaskDueAtDay } from './RecurringTaskDueAtDay';
import type { RecurringTaskDueAtMonth } from './RecurringTaskDueAtMonth';
import type { RecurringTaskPeriod } from './RecurringTaskPeriod';
/**
 * PersonFindArgs.
 */
export type PersonUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: PersonName;
    };
    catch_up_period: {
        should_change: boolean;
        value?: (RecurringTaskPeriod | null);
    };
    catch_up_eisen: {
        should_change: boolean;
        value?: (Eisen | null);
    };
    catch_up_difficulty: {
        should_change: boolean;
        value?: (Difficulty | null);
    };
    catch_up_actionable_from_day: {
        should_change: boolean;
        value?: (RecurringTaskDueAtDay | null);
    };
    catch_up_actionable_from_month: {
        should_change: boolean;
        value?: (RecurringTaskDueAtMonth | null);
    };
    catch_up_due_at_day: {
        should_change: boolean;
        value?: (RecurringTaskDueAtDay | null);
    };
    catch_up_due_at_month: {
        should_change: boolean;
        value?: (RecurringTaskDueAtMonth | null);
    };
    circle_ref_ids: {
        should_change: boolean;
        value?: Array<EntityId>;
    };
};

