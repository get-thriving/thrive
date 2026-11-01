import {
  EmptyHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  buildKeyHabitsStreaksProperties,
  keyHabitsStreaksHabitRefIds,
  parseRefIdList,
  widgetTypeHasProperties,
} from "#/core/home/sub/widget/properties";

describe("widgetTypeHasProperties", () => {
  it("is true only for widgets that can be configured", () => {
    expect(widgetTypeHasProperties(WidgetType.KEY_HABITS_STREAKS)).toBe(true);
    expect(widgetTypeHasProperties(WidgetType.MOTD)).toBe(false);
    expect(widgetTypeHasProperties(WidgetType.COLLABORATION)).toBe(false);
  });
});

describe("keyHabitsStreaksHabitRefIds", () => {
  it("returns the habits in the order they were chosen", () => {
    expect(
      keyHabitsStreaksHabitRefIds(
        buildKeyHabitsStreaksProperties(["3", "1", "2"]),
      ),
    ).toEqual(["3", "1", "2"]);
  });

  it("has no habits for properties of another kind", () => {
    expect(
      keyHabitsStreaksHabitRefIds({
        kind: EmptyHomeWidgetProperties.kind.EMPTY,
      }),
    ).toEqual([]);
  });
});

describe("buildKeyHabitsStreaksProperties", () => {
  it("builds properties of the key habits streaks kind", () => {
    expect(buildKeyHabitsStreaksProperties(["7"])).toEqual({
      kind: KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS,
      habit_ref_ids: ["7"],
    });
  });
});

describe("parseRefIdList", () => {
  it("keeps the order of the ids", () => {
    expect(parseRefIdList("3,1,2")).toEqual(["3", "1", "2"]);
  });

  it("is empty when nothing was submitted", () => {
    expect(parseRefIdList(undefined)).toEqual([]);
    expect(parseRefIdList("")).toEqual([]);
  });

  it("drops blanks and stray spaces", () => {
    expect(parseRefIdList(" 3, ,1 ,,")).toEqual(["3", "1"]);
  });

  it("drops an id that repeats an earlier one", () => {
    expect(parseRefIdList("3,1,3,2,1")).toEqual(["3", "1", "2"]);
  });
});
