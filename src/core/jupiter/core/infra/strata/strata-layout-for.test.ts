import { describe, expect, it } from "vitest";

import { strataLayoutFor } from "#/core/infra/strata/strata-layout-for";
import type { PanelSpec } from "#/core/infra/strata/units";

const habits: PanelSpec[] = [
  { key: "habits", size: 5, grow: true },
  { key: "habit", size: 2 },
];

const RAIL = 52;

describe("strataLayoutFor", () => {
  it("is as many units as fit beside the rail", () => {
    expect(
      [1280, 1440, 1920, 2560].map(
        (width) => strataLayoutFor(habits, 1, width, RAIL).units,
      ),
    ).toEqual([7, 7, 10, 12]);
  });

  it("keeps the rail out of the units", () => {
    expect(strataLayoutFor(habits, 1, 1280, 176).units).toBe(6);
  });

  it("centres the row, with the room nothing took split to its sides", () => {
    const layout = strataLayoutFor(habits, 1, 1920, RAIL);
    expect(layout.description).toBe("habits:5+2 habit:2 _:1");
    const [list, item] = layout.slots;
    const [left, right] = layout.gutters;
    expect(left.side).toBe("left");
    expect(right.side).toBe("right");
    // One unit is spare, half on each side.
    expect(left.width).toBeCloseTo(layout.unitPx / 2, 6);
    expect(right.width).toBeCloseTo(layout.unitPx / 2, 6);
    expect(left.left).toBe(RAIL);
    expect(list.left).toBeCloseTo(left.left + left.width, 6);
    expect(item.left).toBeCloseTo(list.left + list.width, 6);
    expect(right.left).toBeCloseTo(item.left + item.width, 6);
    expect(right.left + right.width).toBeCloseTo(1920, 6);
  });

  it("has no gutters when the row fills the window", () => {
    const layout = strataLayoutFor(habits, 1, 1280, RAIL);
    expect(layout.description).toBe("habits:5 habit:2");
    expect(layout.gutters).toEqual([]);
    expect(layout.slots[0].left).toBe(RAIL);
  });

  it("marks the focused panel and folds the others when it needs the room", () => {
    const path: PanelSpec[] = [
      { key: "a", size: 5 },
      { key: "b", size: 5 },
      { key: "c", size: 5 },
    ];
    const layout = strataLayoutFor(path, 2, 1920, RAIL);
    expect(layout.description).toBe("a:| b:5 c:5");
    expect(layout.slots.map((slot) => slot.focused)).toEqual([
      false,
      false,
      true,
    ]);
    expect(layout.slots[0].width).toBe(10);
  });

  it("marks no panel focused when there is only one", () => {
    const layout = strataLayoutFor([habits[0]], 0, 1440, RAIL);
    expect(layout.slots[0].focused).toBe(false);
  });

  it("clamps a focus that is past the path", () => {
    const layout = strataLayoutFor(habits, 7, 1440, RAIL);
    expect(layout.slots.map((slot) => slot.focused)).toEqual([false, true]);
  });
});
