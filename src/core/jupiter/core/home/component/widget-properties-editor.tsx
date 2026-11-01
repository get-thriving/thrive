import {
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";
import type { Habit } from "@jupiter/webapi-client";

import { KeyHabitsStreaksPropertiesEditor } from "#/core/apps/habits/component/key-habits-streaks-properties-editor";
import {
  keyHabitsStreaksHabitRefIds,
  type HomeWidgetProperties,
} from "#/core/home/sub/widget/properties";

interface WidgetPropertiesEditorProps {
  widgetType: WidgetType;
  properties: HomeWidgetProperties;
  /** The habits that can be picked, for the widgets that show habits. */
  allHabits: Habit[];
  inputsEnabled: boolean;
}

/**
 * The form fields for the properties of a widget, which depend on its type.
 *
 * Renders nothing for a type with no properties. See
 * `widgetTypeHasProperties` for which those are.
 */
export function WidgetPropertiesEditor(props: WidgetPropertiesEditorProps) {
  switch (props.widgetType) {
    case WidgetType.KEY_HABITS_STREAKS:
      return (
        <>
          <input
            type="hidden"
            name="propertiesKind"
            value={KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS}
          />
          <KeyHabitsStreaksPropertiesEditor
            name="habitRefIds"
            allHabits={props.allHabits}
            defaultValue={keyHabitsStreaksHabitRefIds(props.properties)}
            inputsEnabled={props.inputsEnabled}
          />
        </>
      );
    default:
      return null;
  }
}
