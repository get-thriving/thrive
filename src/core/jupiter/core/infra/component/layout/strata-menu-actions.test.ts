import { describe, expect, it } from "vitest";

import {
  strataClearMenuActions,
  strataMenuActionsOf,
  strataSetMenuActions,
} from "#/core/infra/component/layout/strata-menu-actions";

describe("strata menu actions", () => {
  it("lists what each section of a column put there, in order", () => {
    strataSetMenuActions("col-a", { id: "one", commands: [] });
    strataSetMenuActions("col-a", {
      id: "two",
      title: "Streak",
      commands: [],
    });
    expect(strataMenuActionsOf("col-a").map((group) => group.id)).toEqual([
      "one",
      "two",
    ]);
    expect(strataMenuActionsOf("col-b")).toEqual([]);
    expect(strataMenuActionsOf(null)).toEqual([]);
    strataClearMenuActions("col-a", "one");
    strataClearMenuActions("col-a", "two");
  });

  it("replaces a section's own when it draws them anew", () => {
    strataSetMenuActions("col-c", { id: "one", commands: [] });
    strataSetMenuActions("col-c", {
      id: "one",
      title: "New",
      commands: [],
    });
    expect(strataMenuActionsOf("col-c")).toHaveLength(1);
    expect(strataMenuActionsOf("col-c")[0].title).toBe("New");
    strataClearMenuActions("col-c", "one");
  });

  it("is empty again once they are all taken back", () => {
    strataSetMenuActions("col-d", { id: "one", commands: [] });
    strataClearMenuActions("col-d", "one");
    expect(strataMenuActionsOf("col-d")).toEqual([]);
  });
});
