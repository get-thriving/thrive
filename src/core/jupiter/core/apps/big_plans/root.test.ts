import { describe, expect, it } from "vitest";

import { selectKeyBigPlanEntries } from "#/core/apps/big_plans/root";

const entry = (refId: string) => ({
  bigPlan: { ref_id: refId },
  milestones: [refId],
});

describe("selectKeyBigPlanEntries", () => {
  const entries = [entry("1"), entry("2"), entry("3")];

  it("only includes the big plans the widget points at", () => {
    expect(selectKeyBigPlanEntries(entries, ["1", "3"])).toEqual([
      entry("1"),
      entry("3"),
    ]);
  });

  it("keeps the order of the entries, not the order of the chosen ids", () => {
    expect(selectKeyBigPlanEntries(entries, ["3", "1"])).toEqual([
      entry("1"),
      entry("3"),
    ]);
  });

  it("leaves out a big plan that has no entry", () => {
    expect(selectKeyBigPlanEntries(entries, ["9", "2", "8"])).toEqual([
      entry("2"),
    ]);
  });

  it("includes nothing for a widget with no big plans", () => {
    expect(selectKeyBigPlanEntries(entries, [])).toEqual([]);
  });

  it("serves two widgets with different big plans from the same entries", () => {
    expect(
      selectKeyBigPlanEntries(entries, ["1", "2"]).map((e) => e.bigPlan.ref_id),
    ).toEqual(["1", "2"]);
    expect(
      selectKeyBigPlanEntries(entries, ["3", "2"]).map((e) => e.bigPlan.ref_id),
    ).toEqual(["2", "3"]);
  });
});
