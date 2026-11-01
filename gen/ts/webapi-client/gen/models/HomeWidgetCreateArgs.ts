/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyHomeWidgetProperties } from './EmptyHomeWidgetProperties';
import type { EntityId } from './EntityId';
import type { KeyHabitsStreaksHomeWidgetProperties } from './KeyHabitsStreaksHomeWidgetProperties';
import type { WidgetDimension } from './WidgetDimension';
import type { WidgetType } from './WidgetType';
/**
 * The arguments for the create home widget use case.
 */
export type HomeWidgetCreateArgs = {
    home_tab_ref_id: EntityId;
    the_type: WidgetType;
    row: number;
    col: number;
    dimension: WidgetDimension;
    properties: (KeyHabitsStreaksHomeWidgetProperties | EmptyHomeWidgetProperties | null);
};

