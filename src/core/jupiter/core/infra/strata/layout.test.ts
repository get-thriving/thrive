import { describe, expect, it } from "vitest";

import {
  describeLayout,
  fillSequence,
  layoutColumns,
  layoutUnits,
  toPixels,
  unitsForWidth,
  type ColumnSpec,
  type UnitSize,
} from "#/core/infra/strata/layout";

const r = (key: string, size: UnitSize, grow = false): ColumnSpec => ({
  key,
  kind: "route",
  size,
  grow,
});
const lay = (
  columns: ColumnSpec[],
  focus: number,
  units: number,
  extra: {
    order?: "alternate" | "parents" | "children";
    capGrowth?: boolean;
  } = {},
) => describeLayout(layoutUnits({ columns, focus, units, ...extra }));

describe("layoutUnits", () => {
  const habits = [
    r("habits", 3, true),
    r("habit", 2),
    r("note", 2),
    r("events", 1),
    r("tasks", 2),
  ];

  it("shows the focused column whole and folds what doesn't fit", () => {
    expect(lay(habits, 1, 7)).toBe("habits:3 habit:2 note:2 events:| tasks:|");
  });

  it("gives the first column that doesn't fit the leftover units, hashed", () => {
    expect(lay(habits, 4, 8)).toBe(
      "habits:1/3~ habit:2 note:2 events:1 tasks:2",
    );
  });

  it("squeezes a focused column bigger than the screen", () => {
    expect(lay([r("folders", 1), r("doc", 3)], 1, 2)).toBe(
      "folders:| doc:2/3!",
    );
  });

  it("is one column and spines on a phone", () => {
    expect(lay(habits, 1, 1)).toBe(
      "habits:| habit:1/2! note:| events:| tasks:|",
    );
  });

  it("grows the rightmost grower by one size when capped", () => {
    expect(lay([r("folders", 1), r("doc", 3, true)], 1, 7)).toBe(
      "folders:1 doc:3+1 _:2",
    );
  });

  it("gives all spare units to the rightmost grower when uncapped", () => {
    expect(
      lay([r("folders", 1), r("doc", 3, true)], 1, 7, { capGrowth: false }),
    ).toBe("folders:1 doc:3+3");
  });

  it("cascades growth to the next grower on the left", () => {
    expect(lay([r("a", 1, true), r("b", 1, true)], 1, 5)).toBe(
      "a:1+1 b:1+1 _:1",
    );
  });

  it("never grows a column that isn't whole", () => {
    expect(lay([r("a", 3, true), r("b", 2)], 1, 4)).toBe("a:2/3~ b:2");
  });

  it("lets a full column take every unit, squeezing nothing", () => {
    const home: ColumnSpec = { key: "home", kind: "route", size: "full" };
    expect(lay([home], 0, 7)).toBe("home:7");
    expect(lay([r("list", 3), home], 1, 6)).toBe("list:| home:6");
  });

  it("supports three fill orders", () => {
    const path = [r("a", 2), r("b", 2), r("c", 2), r("d", 2)];
    expect(fillSequence(1, 4, "alternate")).toEqual([2, 0, 3]);
    expect(lay(path, 1, 5, { order: "parents" })).toBe("a:2 b:2 c:1/2~ d:|");
    expect(lay(path, 1, 5, { order: "children" })).toBe("a:| b:2 c:2 d:1/2~");
  });
});

/**
 * The time plan screen from the prototype. Route columns: the time plans
 * tree, the plan, and an opened activity. Split columns: the activities
 * section, the note section and spread views of activities. While activities
 * is shown inline, the plan needs B; once it's split out, M is enough.
 */
const timePlan =
  (activityOpen: boolean) =>
  (active: string[]): ColumnSpec[] => {
    const cols: ColumnSpec[] = [
      r("time-plans", 1),
      r("plan", active.includes("activities") ? 2 : 3, true),
    ];
    for (const s of active) {
      if (s === "activities")
        cols.push({
          key: "activities",
          kind: "split",
          size: 3,
          grow: true,
          splitId: s,
        });
      else if (s === "note")
        cols.push({ key: "note", kind: "split", size: 2, splitId: s });
      else
        cols.push({
          key: s.replace("view:", ""),
          kind: "split",
          size: 3,
          splitId: s,
        });
    }
    if (activityOpen) cols.push(r("activity", 2));
    return cols;
  };
const tp = (
  wanted: string[],
  focusKey: string,
  units: number,
  activityOpen = true,
) => {
  const res = layoutColumns({
    wanted,
    build: timePlan(activityOpen),
    focusKey,
    units,
  });
  return { layout: describeLayout(res.layout), folded: res.folded };
};

describe("layoutColumns: time plan", () => {
  it("1440 (X 7): nothing split, activity open", () => {
    expect(tp([], "plan", 7)).toEqual({
      layout: "time-plans:1 plan:3+1 activity:2",
      folded: [],
    });
  });

  it("1440: activities split out, focused", () => {
    expect(tp(["activities"], "activities", 7)).toEqual({
      layout: "time-plans:| plan:2 activities:3 activity:2",
      folded: [],
    });
  });

  it("1440: spreading the week view folds the activities list back into the plan", () => {
    expect(tp(["activities", "view:week"], "week", 7)).toEqual({
      layout: "time-plans:| plan:2/3~ week:3 activity:2",
      folded: ["activities"],
    });
  });

  it("1920 (X 9): list and week fit side by side", () => {
    expect(tp(["activities", "view:week"], "week", 9)).toEqual({
      layout: "time-plans:| plan:1/2~ activities:3 week:3 activity:2",
      folded: [],
    });
  });

  it("1440: closing the activity keeps the list, folds the week view", () => {
    expect(tp(["activities", "view:week"], "plan", 7, false)).toEqual({
      layout: "time-plans:1 plan:2 activities:3+1",
      folded: ["view:week"],
    });
  });

  it("never folds the focused split, and route columns never fold back", () => {
    const res = layoutColumns({
      wanted: ["activities", "note"],
      build: timePlan(true),
      focusKey: "note",
      units: 6,
    });
    expect(res.folded).toEqual(["activities"]);
    expect(res.layout.slots.find((s) => s.key === "note")?.state).toBe("full");
    expect(
      res.layout.slots.filter((s) => s.kind === "route").map((s) => s.key),
    ).toEqual(["time-plans", "plan", "activity"]);
  });

  it("falls back to the last route column when the focus key is gone", () => {
    const res = layoutColumns({
      wanted: [],
      build: timePlan(true),
      focusKey: "week",
      units: 7,
    });
    expect(res.columns[res.layout.focus].key).toBe("activity");
  });
});

describe("unitsForWidth", () => {
  it("targets 190px units, caps at 9 and gives phones 1", () => {
    expect([390, 1280, 1440, 1920, 2560].map((w) => unitsForWidth(w))).toEqual([
      1, 6, 7, 9, 9,
    ]);
  });
});

describe("toPixels", () => {
  it("covers the screen exactly", () => {
    const L = layoutUnits({
      columns: [
        r("habits", 3, true),
        r("habit", 2),
        r("note", 2),
        r("events", 1),
      ],
      focus: 1,
      units: 7,
    });
    const px = toPixels(L, 1440);
    const last = px.slots[px.slots.length - 1];
    expect(px.slots[0].left).toBe(52);
    expect(last.left + last.width).toBeCloseTo(1440, 6);
    expect(px.slots[3].width).toBe(10);
  });

  it("lays a partial slot's content out at its declared size", () => {
    const L = layoutUnits({
      columns: [
        r("habits", 3),
        r("habit", 2),
        r("note", 2),
        r("events", 1),
        r("tasks", 2),
      ],
      focus: 4,
      units: 8,
    });
    const px = toPixels(L, 1440);
    expect(px.slots[0].contentWidth).toBeCloseTo(3 * px.unitPx, 6);
  });
});
