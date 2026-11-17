import { describe, expect, it } from "vitest";

import {
  strataParentPath,
  strataPosition,
} from "#/core/infra/strata/strata-position";

const PATHS = ["/habits/12", "/habits/7", "/habits/30", "/habits/4"];

describe("strataPosition", () => {
  it("finds where the open item is, in the order shown", () => {
    expect(strataPosition(PATHS, "/habits/30")).toEqual({
      index: 2,
      number: 3,
      total: 4,
      previous: 1,
      next: 3,
    });
  });

  it("has no previous for the first and no next for the last", () => {
    expect(strataPosition(PATHS, "/habits/12")).toMatchObject({
      index: 0,
      previous: null,
      next: 1,
    });
    expect(strataPosition(PATHS, "/habits/4")).toMatchObject({
      index: 3,
      previous: 2,
      next: null,
    });
  });

  it("is null when the page is not at any of them", () => {
    expect(strataPosition(PATHS, "/habits/99")).toBeNull();
    expect(strataPosition([], "/habits/12")).toBeNull();
  });

  it("keeps the item open when a panel under it is open", () => {
    expect(strataPosition(PATHS, "/habits/7/streak/3")).toMatchObject({
      index: 1,
    });
  });

  it("does not take /habits/1 for /habits/12", () => {
    expect(
      strataPosition(["/habits/1", "/habits/12"], "/habits/12"),
    ).toMatchObject({ index: 1 });
    expect(strataPosition(["/habits/1"], "/habits/12")).toBeNull();
  });

  it("takes the longest path when one is under another", () => {
    expect(
      strataPosition(
        ["/plans/4", "/plans/4/activity/9"],
        "/plans/4/activity/9",
      ),
    ).toMatchObject({ index: 1 });
  });

  it("ignores a trailing slash", () => {
    expect(strataPosition(["/habits/12/"], "/habits/12")).toMatchObject({
      index: 0,
    });
    expect(strataPosition(["/habits/12"], "/habits/12/")).toMatchObject({
      index: 0,
    });
  });

  it("counts only the items under the same path, in a list of several kinds", () => {
    const mixed = [
      "/habits/habits/12",
      "/core/inbox-tasks/5",
      "/habits/habits/7",
      "/core/inbox-tasks/6",
      "/habits/habits/30",
    ];
    // The third habit of three, whatever is shown among them.
    expect(strataPosition(mixed, "/habits/habits/30")).toEqual({
      index: 4,
      number: 3,
      total: 3,
      previous: 2,
      next: null,
    });
    expect(strataPosition(mixed, "/core/inbox-tasks/5")).toEqual({
      index: 1,
      number: 1,
      total: 2,
      previous: null,
      next: 3,
    });
  });
});

describe("strataParentPath", () => {
  it("is the path without its last part", () => {
    expect(strataParentPath("/habits/habits/12")).toBe("/habits/habits");
    expect(strataParentPath("/habits/habits/12/")).toBe("/habits/habits");
    expect(strataParentPath("/habits")).toBe("");
  });
});
