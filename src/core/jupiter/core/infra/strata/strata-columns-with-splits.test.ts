import { describe, expect, it } from "vitest";

import type { ColumnSpec } from "#/core/infra/strata/layout";
import { strataColumnsWithSplits } from "#/core/infra/strata/strata-columns-with-splits";
import type { StrataSplitSpec } from "#/core/infra/strata/strata-split-spec";

const route = (key: string, size: 1 | 2 | 3, grow = false): ColumnSpec => ({
  key,
  kind: "route",
  size,
  grow,
});

const split = (
  id: string,
  parentKey: string,
  extra: Partial<StrataSplitSpec> = {},
): StrataSplitSpec => ({ id, parentKey, title: id, size: 2, ...extra });

const path = [route("list", 1), route("plan", 3, true), route("activity", 2)];

describe("strataColumnsWithSplits", () => {
  it("is the path when nothing is split", () => {
    const splits = new Map([["notes", split("notes", "plan")]]);
    expect(strataColumnsWithSplits(path, splits, [])).toEqual(path);
  });

  it("puts a split right after the column it comes from", () => {
    const splits = new Map([["notes", split("notes", "plan")]]);
    expect(
      strataColumnsWithSplits(path, splits, ["notes"]).map((c) => c.key),
    ).toEqual(["list", "plan", "split:notes", "activity"]);
  });

  it("keeps the order the splits were opened in", () => {
    const splits = new Map([
      ["notes", split("notes", "plan")],
      ["activities", split("activities", "plan")],
    ]);
    expect(
      strataColumnsWithSplits(path, splits, ["activities", "notes"]).map(
        (c) => c.key,
      ),
    ).toEqual(["list", "plan", "split:activities", "split:notes", "activity"]);
  });

  it("gives a split its own size and growth", () => {
    const splits = new Map([
      ["activities", split("activities", "plan", { size: 3, grow: true })],
    ]);
    const columns = strataColumnsWithSplits(path, splits, ["activities"]);
    expect(columns[2]).toEqual({
      key: "split:activities",
      kind: "split",
      size: 3,
      grow: true,
    });
  });

  it("makes a view of the panel a column of its own kind", () => {
    const splits = new Map([
      ["plan-history", split("plan-history", "plan", { view: true })],
    ]);
    const columns = strataColumnsWithSplits(path, splits, ["plan-history"]);
    expect(columns[2]).toEqual({
      key: "split:plan-history",
      kind: "view",
      size: 2,
      grow: undefined,
    });
  });

  it("shrinks the parent to what its splits leave it", () => {
    const splits = new Map([
      ["activities", split("activities", "plan", { size: 3, parentSize: 2 })],
    ]);
    const columns = strataColumnsWithSplits(path, splits, ["activities"]);
    expect(columns[1].size).toBe(2);
    // The route column it was copied from is left as it was.
    expect(path[1].size).toBe(3);
  });

  it("ignores a split which isn't registered", () => {
    expect(strataColumnsWithSplits(path, new Map(), ["gone"])).toEqual(path);
  });
});
