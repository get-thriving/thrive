/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
/**
 * The properties of a key big plans progress home widget.
 *
 * The widget shows the progress of exactly these big plans. It lays them out
 * by how pressing they are, the same as it always has, so unlike the habits
 * of a key habits streaks widget their order here carries no meaning.
 *
 */
export type KeyBigPlansProgressHomeWidgetProperties = {
    kind: KeyBigPlansProgressHomeWidgetProperties.kind;
    big_plan_ref_ids: Array<EntityId>;
};
export namespace KeyBigPlansProgressHomeWidgetProperties {
    export enum kind {
        KEY_BIG_PLANS_PROGRESS = 'key-big-plans-progress',
    }
}

