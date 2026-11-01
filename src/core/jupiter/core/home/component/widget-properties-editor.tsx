import {
  KeyBigPlansProgressHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";
import type { BigPlan, Habit } from "@jupiter/webapi-client";

import { KeyBigPlansProgressPropertiesEditor } from "#/core/apps/big_plans/component/key-big-plans-progress-properties-editor";
import { KeyHabitsStreaksPropertiesEditor } from "#/core/apps/habits/component/key-habits-streaks-properties-editor";
import {
  keyBigPlansProgressBigPlanRefIds,
  keyHabitsStreaksHabitRefIds,
  type HomeWidgetProperties,
} from "#/core/home/sub/widget/properties";

interface WidgetPropertiesEditorProps {
  widgetType: WidgetType;
  properties: HomeWidgetProperties;
  /** The habits that can be picked, for the widgets that show habits. */
  allHabits: Habit[];
  /** The big plans that can be picked, for the widgets that show big plans. */
  allBigPlans: BigPlan[];
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
    case WidgetType.KEY_BIG_PLANS_PROGRESS:
      return (
        <>
          <input
            type="hidden"
            name="propertiesKind"
            value={
              KeyBigPlansProgressHomeWidgetProperties.kind
                .KEY_BIG_PLANS_PROGRESS
            }
          />
          <KeyBigPlansProgressPropertiesEditor
            name="bigPlanRefIds"
            allBigPlans={props.allBigPlans}
            defaultValue={keyBigPlansProgressBigPlanRefIds(props.properties)}
            inputsEnabled={props.inputsEnabled}
          />
        </>
      );
    default:
      return null;
  }
}
