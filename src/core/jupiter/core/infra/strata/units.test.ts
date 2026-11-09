import { describe, expect, it } from "vitest";

import {
  describeLayout,
  fillSequence,
  layoutUnits,
  toPixels,
  unitsForWidth,
  type PanelSize,
  type PanelSpec,
  type SatelliteSpec,
  type UnitSize,
} from "#/core/infra/strata/units";

// The sizes, in units.
const S = 2;
const M = 3;
const L = 5;

const p = (key: string, size: PanelSize, grow = false): PanelSpec => ({
  key,
  size,
  grow,
});
const s = (key: string, size: UnitSize): SatelliteSpec => ({ key, size });
const lay = (
  panels: PanelSpec[],
  focus: number,
  units: number,
  extra: Partial<Parameters<typeof layoutUnits>[0]> = {},
) => describeLayout(layoutUnits({ panels, focus, units, ...extra }));

/**
 * The screen classes, with the satellites each item panel actually has today
 * (its SectionCards). Sizes and grow flags are the ones on the route handles.
 * Notation: key:3 whole, key:5+2 grown, key:2/5~ partial (a peek),
 * key:3/5! squeezed, key:| spine, trailing "a" = auto satellite, _:2 = empty.
 */
const SCREENS: Record<
  string,
  { path: PanelSpec[]; satellites: SatelliteSpec[] }
> = {
  vacations: {
    path: [p("vacations", S, true), p("vacation", S)],
    satellites: [s("note", M), s("time-events", S)],
  },
  inboxTasks: {
    path: [p("inbox-tasks", L, true), p("inbox-task", S)],
    satellites: [s("time-plans", S)],
  },
  bigPlans: {
    path: [p("big-plans", L, true), p("big-plan", S)],
    satellites: [
      s("milestones", S),
      s("inbox-tasks", M),
      s("note", M),
      s("time-events", S),
      s("time-plans", S),
    ],
  },
  calendar: {
    path: [p("calendar", L, true), p("event", S)],
    satellites: [s("note", M)],
  },
  docs: { path: [p("folders", S), p("doc", L, true)], satellites: [] },
  journals: {
    path: [p("journals", S), p("journal", L, true)],
    satellites: [s("report", M), s("other-journals", S), s("time-plans", S)],
  },
  metrics: {
    path: [p("metrics", S), p("entries", S, true), p("entry", S)],
    satellites: [s("note", M)],
  },
  smartLists: {
    path: [p("smart-lists", S), p("items", S, true), p("item", S)],
    satellites: [s("note", M)],
  },
  habits: {
    path: [p("habits", L, true), p("habit", S)],
    satellites: [
      s("note", M),
      s("time-events", S),
      s("inbox-tasks", M),
      s("time-plans", S),
    ],
  },
  chores: {
    path: [p("chores", L, true), p("chore", S)],
    satellites: [
      s("note", M),
      s("time-events", S),
      s("inbox-tasks", M),
      s("time-plans", S),
    ],
  },
  timePlans: {
    path: [p("time-plans", S), p("time-plan", L, true), p("activity", S)],
    satellites: [s("note", M), s("time-events", S), s("target", S)],
  },
};

/**
 * Focus on the item (the last path panel), nothing pinned. X is 7 at 1280px
 * and 1440px, 10 at 1920px and 12 at 2560px.
 */
const MATRIX: Record<number, Record<string, string>> = {
  7: {
    vacations: "vacations:2 vacation:2 note:3a",
    inboxTasks: "inbox-tasks:5 inbox-task:2",
    bigPlans: "big-plans:5 big-plan:2",
    calendar: "calendar:5 event:2",
    docs: "folders:2 doc:5",
    journals: "journals:2 journal:5",
    metrics: "metrics:2 entries:2+1 entry:2",
    smartLists: "smart-lists:2 items:2+1 item:2",
    habits: "habits:5 habit:2",
    chores: "chores:5 chore:2",
    timePlans: "time-plans:| time-plan:5 activity:2",
  },
  10: {
    vacations: "vacations:2+1 vacation:2 note:3a time-events:2a",
    inboxTasks: "inbox-tasks:5+1 inbox-task:2 time-plans:2a",
    bigPlans: "big-plans:5+1 big-plan:2 milestones:2a",
    calendar: "calendar:5 event:2 note:3a",
    docs: "folders:2 doc:5+2 _:1",
    journals: "journals:2 journal:5 report:3a",
    metrics: "metrics:2 entries:2+1 entry:2 note:3a",
    smartLists: "smart-lists:2 items:2+1 item:2 note:3a",
    habits: "habits:5 habit:2 note:3a",
    chores: "chores:5 chore:2 note:3a",
    timePlans: "time-plans:2 time-plan:5+1 activity:2",
  },
  12: {
    vacations: "vacations:2+1 vacation:2 note:3a time-events:2a _:2",
    inboxTasks: "inbox-tasks:5+2 inbox-task:2 time-plans:2a _:1",
    bigPlans: "big-plans:5 big-plan:2 milestones:2a inbox-tasks:3a",
    calendar: "calendar:5+2 event:2 note:3a",
    docs: "folders:2 doc:5+2 _:3",
    journals: "journals:2 journal:5 report:3a other-journals:2a",
    metrics: "metrics:2 entries:2+1 entry:2 note:3a _:2",
    smartLists: "smart-lists:2 items:2+1 item:2 note:3a _:2",
    habits: "habits:5 habit:2 note:3a time-events:2a",
    chores: "chores:5 chore:2 note:3a time-events:2a",
    timePlans: "time-plans:2 time-plan:5 activity:2 note:3a",
  },
};

describe("screen matrix", () => {
  for (const [x, row] of Object.entries(MATRIX)) {
    for (const [name, expected] of Object.entries(row)) {
      it(`${name} at X=${x}`, () => {
        const sc = SCREENS[name];
        const r = layoutUnits({
          panels: sc.path,
          focus: sc.path.length - 1,
          units: Number(x),
          satellites: sc.satellites,
        });
        expect(describeLayout(r)).toBe(expected);
        expect(r.usedUnits + r.emptyUnits).toBe(Number(x));
      });
    }
  }
});

describe("filling the path", () => {
  const habitsWithSatellites = [
    p("habits", L, true),
    p("habit", S),
    p("note", M),
    p("time-events", S),
    p("inbox-tasks", M),
  ];

  it("shows the focused panel whole and folds what doesn't fit", () => {
    expect(lay(habitsWithSatellites, 1, 10)).toBe(
      "habits:5 habit:2 note:3 time-events:| inbox-tasks:|",
    );
  });

  it("gives the first panel that doesn't fit the leftover units, as a peek", () => {
    expect(lay(habitsWithSatellites, 4, 12)).toBe(
      "habits:2/5~ habit:2 note:3 time-events:2 inbox-tasks:3",
    );
  });

  it("folds ancestors when focus is deep", () => {
    expect(lay(habitsWithSatellites, 4, 10)).toBe(
      "habits:| habit:2 note:3 time-events:2 inbox-tasks:3",
    );
  });

  it("squeezes a focused panel that is bigger than the screen", () => {
    expect(lay([p("folders", S), p("doc", L)], 1, 3)).toBe(
      "folders:| doc:3/5!",
    );
  });

  it("is one panel and spines on a phone", () => {
    expect(lay(habitsWithSatellites, 1, 1)).toBe(
      "habits:| habit:1/2! note:| time-events:| inbox-tasks:|",
    );
  });

  it("fill orders differ in who wins the last units", () => {
    const path = [p("a", M), p("b", M), p("c", M), p("d", M)];
    expect(fillSequence(1, 4, "alternate")).toEqual([2, 0, 3]);
    expect(fillSequence(1, 4, "parents")).toEqual([0, 2, 3]);
    expect(fillSequence(1, 4, "children")).toEqual([2, 3, 0]);
    expect(lay(path, 1, 8, { order: "parents" })).toBe("a:3 b:3 c:2/3~ d:|");
    expect(lay(path, 1, 8, { order: "children" })).toBe("a:| b:3 c:3 d:2/3~");
  });
});

describe("a full panel", () => {
  it("takes the whole screen when it is alone", () => {
    expect(lay([p("home", "full")], 0, 10)).toBe("home:10");
    expect(lay([p("home", "full")], 0, 7)).toBe("home:7");
  });

  it("takes the whole screen when it is focused, and folds the rest", () => {
    expect(lay([p("home", "full"), p("settings", S)], 0, 10)).toBe(
      "home:10 settings:|",
    );
  });

  it("is a peek beside a newer panel, laid out at the whole screen", () => {
    const r = layoutUnits({
      panels: [p("home", "full"), p("settings", S)],
      focus: 1,
      units: 10,
    });
    expect(describeLayout(r)).toBe("home:8/10~ settings:2");
    const px = toPixels(r, 1920);
    expect(px.slots[0].contentWidth).toBeCloseTo(10 * px.unitPx, 6);
  });

  it("never grows, as nothing is left", () => {
    expect(lay([p("home", "full", true)], 0, 10)).toBe("home:10");
  });
});

describe("spare units", () => {
  it("open satellites first, skipping ones that don't fit", () => {
    expect(
      lay([p("big-plans", L, true), p("big-plan", S)], 1, 11, {
        satellites: [
          s("milestones", S),
          s("inbox-tasks", M),
          s("time-events", S),
        ],
      }),
    ).toBe("big-plans:5 big-plan:2 milestones:2a time-events:2a");
  });

  it("then grow the rightmost grower one size step when capped", () => {
    // L steps to XL, which is 2 more units.
    expect(lay([p("folders", S), p("doc", L, true)], 1, 11)).toBe(
      "folders:2 doc:5+2 _:2",
    );
    // S steps to M, which is 1 more.
    expect(lay([p("list", S, true), p("item", S)], 1, 6)).toBe(
      "list:2+1 item:2 _:1",
    );
    // M steps to L, which is 2 more.
    expect(lay([p("list", M, true), p("item", S)], 1, 9)).toBe(
      "list:3+2 item:2 _:2",
    );
  });

  it("give everything to the rightmost grower when uncapped", () => {
    expect(
      lay([p("folders", S), p("doc", L, true)], 1, 11, { capGrowth: false }),
    ).toBe("folders:2 doc:5+4");
  });

  it("cascade to the next grower on the left when capped", () => {
    expect(lay([p("a", S, true), p("b", S, true)], 1, 8)).toBe(
      "a:2+1 b:2+1 _:2",
    );
  });

  it("never grow a panel that isn't whole", () => {
    expect(lay([p("a", L, true), p("b", M)], 1, 6)).toBe("a:3/5~ b:3");
  });
});

describe("unitsForWidth", () => {
  it("targets 175px units, caps at 12 and gives phones 1", () => {
    expect(
      [390, 900, 1280, 1440, 1920, 2560].map((w) => unitsForWidth(w)),
    ).toEqual([1, 4, 7, 7, 10, 12]);
  });
});

describe("toPixels", () => {
  it("covers the screen exactly", () => {
    const r = layoutUnits({
      panels: [
        p("habits", L, true),
        p("habit", M),
        p("note", M),
        p("time-events", S),
      ],
      focus: 1,
      units: 11,
    });
    const px = toPixels(r, 1440);
    const last = px.slots[px.slots.length - 1];
    expect(px.slots[0].left).toBe(52);
    expect(last.left + last.width).toBeCloseTo(1440, 6);
    expect(px.slots[3].width).toBe(10);
  });

  it("lays a partial slot's content out at its declared size", () => {
    const r = layoutUnits({
      panels: [
        p("habits", L),
        p("habit", M),
        p("note", M),
        p("time-events", S),
        p("inbox-tasks", M),
      ],
      focus: 4,
      units: 12,
    });
    const px = toPixels(r, 1440);
    expect(px.slots[0].width).toBeCloseTo(px.unitPx, 6);
    expect(px.slots[0].contentWidth).toBeCloseTo(5 * px.unitPx, 6);
  });
});
