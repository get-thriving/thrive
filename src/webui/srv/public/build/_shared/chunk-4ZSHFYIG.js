import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/home/sub/widget/root.ts
var import_webapi_client = __toESM(require_dist(), 1);
function widgetTypeName(type) {
  switch (type) {
    case import_webapi_client.WidgetType.MOTD:
      return "Message of the Day";
    case import_webapi_client.WidgetType.KEY_HABITS_STREAKS:
      return "Key Habits Streaks";
    case import_webapi_client.WidgetType.HABIT_INBOX_TASKS:
      return "Habit Tasks";
    case import_webapi_client.WidgetType.RANDOM_HABIT:
      return "Random Habit";
    case import_webapi_client.WidgetType.CHORE_INBOX_TASKS:
      return "Chore Tasks";
    case import_webapi_client.WidgetType.TODO_INBOX_TASKS:
      return "Todo Tasks";
    case import_webapi_client.WidgetType.RANDOM_CHORE:
      return "Random Chore";
    case import_webapi_client.WidgetType.KEY_BIG_PLANS_PROGRESS:
      return "Key Big Plans Progress";
    case import_webapi_client.WidgetType.UPCOMING_BIRTHDAYS:
      return "Upcoming Birthdays";
    case import_webapi_client.WidgetType.CALENDAR_DAY:
      return "Calendar For Today";
    case import_webapi_client.WidgetType.SCHEDULE_DAY:
      return "Schedule For Today";
    case import_webapi_client.WidgetType.TIME_PLAN_VIEW:
      return "Time Plan View";
    case import_webapi_client.WidgetType.GAMIFICATION_OVERVIEW:
      return "Gamification Overview";
    case import_webapi_client.WidgetType.GAMIFICATION_HISTORY_WEEKLY:
      return "Weekly Score History";
    case import_webapi_client.WidgetType.GAMIFICATION_HISTORY_MONTHLY:
      return "Monthly Score History";
    case import_webapi_client.WidgetType.LIFE_WEEKS:
      return "Life Weeks";
    case import_webapi_client.WidgetType.LIFE_VISION:
      return "Life Vision";
    case import_webapi_client.WidgetType.LIFE_CHAPTERS:
      return "Life Chapters";
  }
}
function widgetDimensionRows(dimension) {
  switch (dimension) {
    case import_webapi_client.WidgetDimension.DIM_1X1:
    case import_webapi_client.WidgetDimension.DIM_1X2:
    case import_webapi_client.WidgetDimension.DIM_1X3:
    case import_webapi_client.WidgetDimension.DIM_KX1:
    case import_webapi_client.WidgetDimension.DIM_KX2:
    case import_webapi_client.WidgetDimension.DIM_KX3:
      return 1;
    case import_webapi_client.WidgetDimension.DIM_2X1:
    case import_webapi_client.WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX:
    case import_webapi_client.WidgetDimension.DIM_2X2:
    case import_webapi_client.WidgetDimension.DIM_2X3:
      return 2;
    case import_webapi_client.WidgetDimension.DIM_3X1:
    case import_webapi_client.WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX:
    case import_webapi_client.WidgetDimension.DIM_3X2:
    case import_webapi_client.WidgetDimension.DIM_3X3:
      return 3;
  }
}
function widgetDimensionCols(dimension) {
  switch (dimension) {
    case import_webapi_client.WidgetDimension.DIM_1X1:
    case import_webapi_client.WidgetDimension.DIM_2X1:
    case import_webapi_client.WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX:
    case import_webapi_client.WidgetDimension.DIM_3X1:
    case import_webapi_client.WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX:
    case import_webapi_client.WidgetDimension.DIM_KX1:
      return 1;
    case import_webapi_client.WidgetDimension.DIM_1X2:
    case import_webapi_client.WidgetDimension.DIM_2X2:
    case import_webapi_client.WidgetDimension.DIM_3X2:
    case import_webapi_client.WidgetDimension.DIM_KX2:
      return 2;
    case import_webapi_client.WidgetDimension.DIM_1X3:
    case import_webapi_client.WidgetDimension.DIM_2X3:
    case import_webapi_client.WidgetDimension.DIM_3X3:
    case import_webapi_client.WidgetDimension.DIM_KX3:
      return 3;
  }
}
function isWidgetDimensionKSized(dimension) {
  return dimension === import_webapi_client.WidgetDimension.DIM_KX1 || dimension === import_webapi_client.WidgetDimension.DIM_KX2 || dimension === import_webapi_client.WidgetDimension.DIM_KX3;
}
function isWidgetDimensionFlex(dimension) {
  return dimension === import_webapi_client.WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX || dimension === import_webapi_client.WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX;
}
function widgetDimensionName(dimension) {
  if (dimension === import_webapi_client.WidgetDimension.DIM_2X1_SMALL_SCREEN_FLEX) {
    return `2x1 (small screen flex)`;
  }
  if (dimension === import_webapi_client.WidgetDimension.DIM_3X1_SMALL_SCREEN_FLEX) {
    return `3x1 (small screen flex)`;
  }
  if (isWidgetDimensionKSized(dimension)) {
    return `kx${widgetDimensionCols(dimension)}`;
  }
  const rows = widgetDimensionRows(dimension);
  const cols = widgetDimensionCols(dimension);
  return `${rows}x${cols}`;
}
function isAllowedForWidgetConstraints(constraints, user, workspace) {
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

export {
  widgetTypeName,
  widgetDimensionRows,
  widgetDimensionCols,
  isWidgetDimensionKSized,
  isWidgetDimensionFlex,
  widgetDimensionName,
  isAllowedForWidgetConstraints
};
//# sourceMappingURL=/build/_shared/chunk-4ZSHFYIG.js.map
