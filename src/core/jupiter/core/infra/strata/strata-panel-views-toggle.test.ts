import { describe, expect, it } from "vitest";

import {
  strataPanelViewId,
  strataPanelViewsPanelId,
} from "#/core/infra/strata/strata-panel-view-id";
import { strataPanelViewsToggle } from "#/core/infra/strata/strata-panel-views-toggle";

describe("strataPanelViewsToggle", () => {
  it("opens a view after the ones already open", () => {
    expect(strataPanelViewsToggle([], "leaf-history", false)).toEqual([
      "leaf-history",
    ]);
    expect(
      strataPanelViewsToggle(["leaf-history"], "leaf-publish", false),
    ).toEqual(["leaf-history", "leaf-publish"]);
  });

  it("closes a view that is open, keeping the others", () => {
    expect(
      strataPanelViewsToggle(
        ["leaf-history", "leaf-publish"],
        "leaf-history",
        false,
      ),
    ).toEqual(["leaf-publish"]);
  });

  it("closes the others on a phone, where a view replaces the content", () => {
    expect(
      strataPanelViewsToggle(["leaf-history"], "leaf-publish", true),
    ).toEqual(["leaf-publish"]);
    expect(
      strataPanelViewsToggle(["leaf-publish"], "leaf-publish", true),
    ).toEqual([]);
  });

  it("does not change what it was given", () => {
    const open = ["leaf-history"];
    strataPanelViewsToggle(open, "leaf-publish", false);
    expect(open).toEqual(["leaf-history"]);
  });
});

describe("strataPanelViewId", () => {
  it("is unique per place on the path and per view", () => {
    expect(strataPanelViewId("leaf", "history")).toBe("leaf-history");
    expect(strataPanelViewId("leaflet", "history")).toBe("leaflet-history");
    expect(strataPanelViewId("branch", "access")).toBe("branch-access");
  });

  it("keeps the open views in a panel id of their own", () => {
    expect(strataPanelViewsPanelId("trunk")).toBe("trunk-views");
  });
});
