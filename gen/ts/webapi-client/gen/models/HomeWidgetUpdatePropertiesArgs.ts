/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmptyHomeWidgetProperties } from './EmptyHomeWidgetProperties';
import type { EntityId } from './EntityId';
import type { KeyHabitsStreaksHomeWidgetProperties } from './KeyHabitsStreaksHomeWidgetProperties';
/**
 * The arguments for changing the properties of a home widget.
 */
export type HomeWidgetUpdatePropertiesArgs = {
    ref_id: EntityId;
    properties: (KeyHabitsStreaksHomeWidgetProperties | EmptyHomeWidgetProperties);
};

