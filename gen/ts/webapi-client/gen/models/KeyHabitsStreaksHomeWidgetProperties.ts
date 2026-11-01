/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * The properties of a key habits streaks home widget.
 *
 * The widget shows the streaks of exactly these habits, in this order.
 *
 */
export type KeyHabitsStreaksHomeWidgetProperties = {
    kind: KeyHabitsStreaksHomeWidgetProperties.kind;
    habit_ref_ids: Array<EntityId>;
};
export namespace KeyHabitsStreaksHomeWidgetProperties {
    export enum kind {
        KEY_HABITS_STREAKS = 'key-habits-streaks',
    }
}

