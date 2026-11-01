import {
  EntityId,
  HomeWidget,
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";

export type HomeWidgetProperties = HomeWidget["properties"];

/** Whether widgets of this type have properties a user can configure. */
export function widgetTypeHasProperties(type: WidgetType): boolean {
  return type === WidgetType.KEY_HABITS_STREAKS;
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
