import { describe, expect, it } from "vitest";

import type { ColumnSpec } from "#/core/infra/strata/layout";
import { strataLayoutFor } from "#/core/infra/strata/strata-layout-for";

const habits: ColumnSpec[] = [
  { key: "habits", kind: "route", size: 3, grow: true },
  { key: "habit", kind: "route", size: 2 },
];

const RAIL = 52;

describe("strataLayoutFor", () => {
  it("is as many units as fit beside the rail", () => {
    expect(
      [1280, 1440, 1920, 2560].map(
        (width) => strataLayoutFor(habits, 1, width, RAIL).units,
      ),
    ).toEqual([6, 7, 9, 9]);
  });

  it("keeps the rail out of the units", () => {
    expect(strataLayoutFor(habits, 1, 1280, 176).units).toBe(5);
  });

  it("centres the row, with the room nothing took split to its sides", () => {
    const layout = strataLayoutFor(habits, 1, 1920, RAIL);
    expect(layout.description).toBe("habits:3+1 habit:2 _:3");
    const [list, item] = layout.slots;
    const [left, right] = layout.gutters;
    expect(left.side).toBe("left");
    expect(right.side).toBe("right");
    // Three units are spare, half of them on each side.
    expect(left.width).toBeCloseTo(1.5 * layout.unitPx, 6);
    expect(right.width).toBeCloseTo(1.5 * layout.unitPx, 6);
    expect(left.left).toBe(RAIL);
    expect(list.left).toBeCloseTo(left.left + left.width, 6);
    expect(item.left).toBeCloseTo(list.left + list.width, 6);
    expect(right.left).toBeCloseTo(item.left + item.width, 6);
    expect(right.left + right.width).toBeCloseTo(1920, 6);
  });

  it("has no gutters when the row fills the window", () => {
    const layout = strataLayoutFor(habits, 1, 1280, RAIL);
    expect(layout.description).toBe("habits:3+1 habit:2");
    expect(layout.gutters).toEqual([]);
    expect(layout.slots[0].left).toBe(RAIL);
  });

  it("marks the focused panel and folds the others when it needs the room", () => {
    const path: ColumnSpec[] = [
      { key: "a", kind: "route", size: 3 },
      { key: "b", kind: "route", size: 3 },
      { key: "c", kind: "route", size: 3 },
    ];
    const layout = strataLayoutFor(path, 2, 1280, RAIL);
    expect(layout.description).toBe("a:| b:3 c:3");
    expect(layout.slots.map((slot) => slot.focused)).toEqual([
      false,
      false,
      true,
    ]);
    expect(layout.slots[0].width).toBe(10);
  });

  it("takes the whole window for a full column", () => {
    const layout = strataLayoutFor(
      [{ key: "home", kind: "route", size: "full" }],
      0,
      1440,
      RAIL,
    );
    expect(layout.description).toBe("home:7");
    expect(layout.gutters).toEqual([]);
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
