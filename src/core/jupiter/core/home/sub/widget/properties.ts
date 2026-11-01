import {
  EntityId,
  HomeWidget,
  KeyBigPlansProgressHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";

export type HomeWidgetProperties = HomeWidget["properties"];

/** Whether widgets of this type have properties a user can configure. */
export function widgetTypeHasProperties(type: WidgetType): boolean {
  return (
    type === WidgetType.KEY_HABITS_STREAKS ||
    type === WidgetType.KEY_BIG_PLANS_PROGRESS
  );
}

/**
 * The habits a key habits streaks widget is set up to show, in the order it
 * shows them. Any other kind of properties has none.
 */
export function keyHabitsStreaksHabitRefIds(
  properties: HomeWidgetProperties,
): EntityId[] {
  if (
    properties.kind ===
    KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS
  ) {
    return properties.habit_ref_ids;
  }
  return [];
}

export function buildKeyHabitsStreaksProperties(
  habitRefIds: EntityId[],
): KeyHabitsStreaksHomeWidgetProperties {
  return {
    kind: KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS,
    habit_ref_ids: habitRefIds,
  };
}

/**
 * The big plans a key big plans progress widget is set up to include. Any other
 * kind of properties has none.
 */
export function keyBigPlansProgressBigPlanRefIds(
  properties: HomeWidgetProperties,
): EntityId[] {
  if (
    properties.kind ===
    KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS
  ) {
    return properties.big_plan_ref_ids;
  }
  return [];
}

export function buildKeyBigPlansProgressProperties(
  bigPlanRefIds: EntityId[],
): KeyBigPlansProgressHomeWidgetProperties {
  return {
    kind: KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS,
    big_plan_ref_ids: bigPlanRefIds,
  };
}

/** What the properties editors submit, whichever widget they are editing. */
export interface WidgetPropertiesForm {
  propertiesKind: HomeWidgetProperties["kind"];
  habitRefIds?: string;
  bigPlanRefIds?: string;
}

/** Turns what the properties editors submitted into properties to save. */
export function widgetPropertiesFromForm(
  form: WidgetPropertiesForm,
): HomeWidgetProperties {
  switch (form.propertiesKind) {
    case KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS:
      return buildKeyHabitsStreaksProperties(parseRefIdList(form.habitRefIds));
    case KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS:
      return buildKeyBigPlansProgressProperties(
        parseRefIdList(form.bigPlanRefIds),
      );
    default:
      throw new Error(
        `Widgets with ${form.propertiesKind} properties cannot be edited`,
      );
  }
}

/**
 * Reads a list of ids as a form submits it: comma separated, in order. Blanks
 * are dropped, and so is any id that repeats an earlier one.
 */
export function parseRefIdList(raw: string | undefined): EntityId[] {
  const seen = new Set<string>();
  const refIds: EntityId[] = [];
  for (const part of (raw ?? "").split(",")) {
    const refId = part.trim();
    if (refId.length === 0 || seen.has(refId)) {
      continue;
    }
    seen.add(refId);
    refIds.push(refId);
  }
  return refIds;
}
