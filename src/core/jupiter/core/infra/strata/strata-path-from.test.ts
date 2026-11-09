import { describe, expect, it } from "vitest";

import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { strataPathFrom } from "#/core/infra/strata/strata-path-from";
import { strataSpecFor } from "#/core/infra/strata/strata-spec-for";

describe("strataSpecFor", () => {
  it("uses the fallback for each display type", () => {
    const sizes = [
      DisplayType.TRUNK,
      DisplayType.BRANCH,
      DisplayType.LEAF,
      DisplayType.LEAFLET,
      DisplayType.TOOL,
    ].map((displayType) => strataSpecFor("k", { displayType })?.size);
    expect(sizes).toEqual([3, 3, 2, 2, 3]);
  });

  it("never grows by fallback", () => {
    expect(strataSpecFor("k", { displayType: DisplayType.TRUNK })?.grow).toBe(
      false,
    );
  });

  it("takes the size and growth a route declares", () => {
    expect(
      strataSpecFor("habits", {
        displayType: DisplayType.TRUNK,
        strata: { size: "L", grow: true },
      }),
    ).toEqual({ key: "habits", size: 5, grow: true });
  });

  it("takes the whole screen for FULL", () => {
    expect(
      strataSpecFor("home", {
        displayType: DisplayType.TRUNK,
        strata: { size: "FULL" },
      }),
    ).toEqual({ key: "home", size: "full", grow: false });
  });

  it("falls back when the declaration is malformed", () => {
    expect(
      strataSpecFor("k", {
        displayType: DisplayType.LEAF,
        strata: { size: "XL" },
      })?.size,
    ).toBe(2);
  });

  it("is not a panel without a panel display type", () => {
    expect(strataSpecFor("root", undefined)).toBeNull();
    expect(strataSpecFor("root", {})).toBeNull();
    expect(strataSpecFor("root", { displayType: DisplayType.ROOT })).toBeNull();
  });
});

describe("strataPathFrom", () => {
  it("lists the panels in route order, keyed by match id, and skips the rest", () => {
    const path = strataPathFrom([
      { id: "root", handle: undefined },
      { id: "workspace", handle: {} },
      {
        id: "habits",
        handle: {
          displayType: DisplayType.TRUNK,
          strata: { size: "L", grow: true },
        },
      },
      { id: "habit", handle: { displayType: DisplayType.LEAF } },
      {
        id: "inactive-period",
        handle: { displayType: DisplayType.LEAFLET },
      },
    ]);
    expect(path).toEqual([
      { key: "habits", size: 5, grow: true },
      { key: "habit", size: 2, grow: false },
      { key: "inactive-period", size: 2, grow: false },
    ]);
  });

  it("is empty when no route is a panel", () => {
    expect(strataPathFrom([{ id: "root", handle: undefined }])).toEqual([]);
  });
});
