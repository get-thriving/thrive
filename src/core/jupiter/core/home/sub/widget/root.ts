import {
  EntityId,
  HomeWidget,
  KeyBigPlansProgressHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  User,
  WidgetDimension,
  WidgetType,
  WidgetTypeConstraints,
  Workspace,
} from "@jupiter/webapi-client";

export function widgetTypeName(type: WidgetType): string {
  switch (type) {
    case WidgetType.MOTD:
      return "Message of the Day";
    case WidgetType.KEY_HABITS_STREAKS:
      return "Key Habits Streaks";
    case WidgetType.HABIT_INBOX_TASKS:
      return "Habit Tasks";
    case WidgetType.RANDOM_HABIT:
      return "Random Habit";
    case WidgetType.CHORE_INBOX_TASKS:
      return "Chore Tasks";
    case WidgetType.TODO_INBOX_TASKS:
      return "Todo Tasks";
    case WidgetType.RANDOM_CHORE:
      return "Random Chore";
    case WidgetType.KEY_BIG_PLANS_PROGRESS:
      return "Key Big Plans Progress";
    case WidgetType.UPCOMING_BIRTHDAYS:
      return "Upcoming Birthdays";
    case WidgetType.CALENDAR_DAY:
      return "Calendar For Today";
    case WidgetType.SCHEDULE_DAY:
      return "Schedule For Today";
    case WidgetType.TIME_PLAN_VIEW:
      return "Time Plan View";
    case WidgetType.GAMIFICATION_OVERVIEW:
      return "Gamification Overview";
    case WidgetType.GAMIFICATION_HISTORY_WEEKLY:
      return "Weekly Score History";
    case WidgetType.GAMIFICATION_HISTORY_MONTHLY:
      return "Monthly Score History";
    case WidgetType.LIFE_WEEKS:
      return "Life Weeks";
    case WidgetType.LIFE_VISION:
      return "Life Vision";
    case WidgetType.LIFE_CHAPTERS:
      return "Life Chapters";
    case WidgetType.COLLABORATION:
      return "Collaboration";
  }
}

export function widgetDimensionRows(dimension: WidgetDimension): number {
  switch (dimension) {
    case WidgetDimension.DIM_1X1:
    case WidgetDimension.DIM_1X2:
    case WidgetDimension.DIM_1X3:
    case WidgetDimension.DIM_KX1:
    case WidgetDimension.DIM_KX2:
    case WidgetDimension.DIM_KX3:
      return 1;
    case WidgetDimension.DIM_2X1:
    case WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX:
    case WidgetDimension.DIM_2X2:
    case WidgetDimension.DIM_2X3:
      return 2;
    case WidgetDimension.DIM_3X1:
    case WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX:
    case WidgetDimension.DIM_3X2:
    case WidgetDimension.DIM_3X3:
      return 3;
  }
}

export function widgetDimensionCols(dimension: WidgetDimension): number {
  switch (dimension) {
    case WidgetDimension.DIM_1X1:
    case WidgetDimension.DIM_2X1:
    case WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX:
    case WidgetDimension.DIM_3X1:
    case WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX:
    case WidgetDimension.DIM_KX1:
      return 1;
    case WidgetDimension.DIM_1X2:
    case WidgetDimension.DIM_2X2:
    case WidgetDimension.DIM_3X2:
    case WidgetDimension.DIM_KX2:
      return 2;
    case WidgetDimension.DIM_1X3:
    case WidgetDimension.DIM_2X3:
    case WidgetDimension.DIM_3X3:
    case WidgetDimension.DIM_KX3:
      return 3;
  }
}

export function isWidgetDimensionKSized(dimension: WidgetDimension): boolean {
  return (
    dimension === WidgetDimension.DIM_KX1 ||
    dimension === WidgetDimension.DIM_KX2 ||
    dimension === WidgetDimension.DIM_KX3
  );
}

export function isWidgetDimensionFlex(dimension: WidgetDimension): boolean {
  return (
    dimension === WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX ||
    dimension === WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX
  );
}

export function widgetDimensionName(dimension: WidgetDimension): string {
  if (dimension === WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX) {
    return `2x1 (small screen flex)`;
  }

  if (dimension === WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX) {
    return `3x1 (small screen flex)`;
  }

  if (isWidgetDimensionKSized(dimension)) {
    return `kx${widgetDimensionCols(dimension)}`;
  }
  const rows = widgetDimensionRows(dimension);
  const cols = widgetDimensionCols(dimension);

  return `${rows}x${cols}`;
}

export function isAllowedForWidgetConstraints(
  constraints: WidgetTypeConstraints,
  user: User,
  workspace: Workspace,
): boolean {
  // Keep in sync with the logic in the backend in
  // widget.py:is_allowed_for
  if (constraints.only_for_user_features) {
    for (const userFeature of constraints.only_for_user_features) {
      if (!user.feature_flags[userFeature]) {
        return false;
      }
    }
  }

  if (constraints.only_for_workspace_features) {
    for (const workspaceFeature of constraints.only_for_workspace_features) {
      if (!workspace.feature_flags[workspaceFeature]) {
        return false;
      }
    }
  }

  return true;
}

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
