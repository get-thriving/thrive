import {
  EmptyHomeWidgetProperties,
  KeyBigPlansProgressHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  WidgetType,
} from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import {
  buildKeyBigPlansProgressProperties,
  buildKeyHabitsStreaksProperties,
  keyBigPlansProgressBigPlanRefIds,
  keyHabitsStreaksHabitRefIds,
  parseRefIdList,
  widgetPropertiesFromForm,
  widgetTypeHasProperties,
} from "#/core/home/sub/widget/properties";

describe("widgetTypeHasProperties", () => {
  it("is true only for widgets that can be configured", () => {
    expect(widgetTypeHasProperties(WidgetType.KEY_HABITS_STREAKS)).toBe(true);
    expect(widgetTypeHasProperties(WidgetType.KEY_BIG_PLANS_PROGRESS)).toBe(
      true,
    );
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

describe("keyBigPlansProgressBigPlanRefIds", () => {
  it("returns the big plans the widget includes", () => {
    expect(
      keyBigPlansProgressBigPlanRefIds(
        buildKeyBigPlansProgressProperties(["3", "1", "2"]),
      ),
    ).toEqual(["3", "1", "2"]);
  });

  it("has no big plans for properties of another kind", () => {
    expect(
      keyBigPlansProgressBigPlanRefIds({
        kind: EmptyHomeWidgetProperties.kind.EMPTY,
      }),
    ).toEqual([]);
    expect(
      keyBigPlansProgressBigPlanRefIds(buildKeyHabitsStreaksProperties(["1"])),
    ).toEqual([]);
  });
});

describe("buildKeyBigPlansProgressProperties", () => {
  it("builds properties of the key big plans progress kind", () => {
    expect(buildKeyBigPlansProgressProperties(["7"])).toEqual({
      kind: KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS,
      big_plan_ref_ids: ["7"],
    });
  });
});

describe("widgetPropertiesFromForm", () => {
  it("builds habit properties from what the habits editor submitted", () => {
    expect(
      widgetPropertiesFromForm({
        propertiesKind:
          KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS,
        habitRefIds: "3,1",
        bigPlanRefIds: "9",
      }),
    ).toEqual(buildKeyHabitsStreaksProperties(["3", "1"]));
  });

  it("builds big plan properties from what the big plans editor submitted", () => {
    expect(
      widgetPropertiesFromForm({
        propertiesKind:
          KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS,
        habitRefIds: "9",
        bigPlanRefIds: "4,2",
      }),
    ).toEqual(buildKeyBigPlansProgressProperties(["4", "2"]));
  });

  it("builds empty lists when nothing was chosen", () => {
    expect(
      widgetPropertiesFromForm({
        propertiesKind:
          KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS,
      }),
    ).toEqual(buildKeyBigPlansProgressProperties([]));
  });

  it("refuses properties that have nothing to edit", () => {
    expect(() =>
      widgetPropertiesFromForm({
        propertiesKind: EmptyHomeWidgetProperties.kind.EMPTY,
      }),
    ).toThrow();
  });
});
