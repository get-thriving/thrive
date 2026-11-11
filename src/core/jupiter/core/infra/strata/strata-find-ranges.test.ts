import { describe, expect, it } from "vitest";

import {
  strataFindRanges,
  strataFindStep,
} from "#/core/infra/strata/strata-find-ranges";

describe("strataFindRanges", () => {
  it("finds nothing for an empty query, or one of only space", () => {
    expect(strataFindRanges("Morning walk", "")).toEqual([]);
    expect(strataFindRanges("Morning walk", "  ")).toEqual([]);
  });

  it("finds every place, whatever the case", () => {
    expect(strataFindRanges("Walk, then walk, then WALK", "walk")).toEqual([
      { start: 0, end: 4 },
      { start: 11, end: 15 },
      { start: 22, end: 26 },
    ]);
  });

  it("keeps the space of a query", () => {
    expect(strataFindRanges("a walk, awalk", " walk")).toEqual([
      { start: 1, end: 6 },
    ]);
  });

  it("does not overlap matches", () => {
    expect(strataFindRanges("aaaa", "aa")).toEqual([
      { start: 0, end: 2 },
      { start: 2, end: 4 },
    ]);
  });

  it("takes the characters of a regular expression for themselves", () => {
    expect(strataFindRanges("a.b a+b (a)", "a.b")).toEqual([
      { start: 0, end: 3 },
    ]);
    expect(strataFindRanges("a.b a+b (a)", "(a)")).toEqual([
      { start: 8, end: 11 },
    ]);
    expect(strataFindRanges("a.b a+b (a)", "[")).toEqual([]);
  });

  it("finds nothing when the text has none of it", () => {
    expect(strataFindRanges("Morning walk", "run")).toEqual([]);
  });
});

describe("strataFindStep", () => {
  it("goes on to the next and back to the previous", () => {
    expect(strataFindStep(1, 4, "next")).toBe(2);
    expect(strataFindStep(2, 4, "previous")).toBe(1);
  });

  it("goes round at the ends", () => {
    expect(strataFindStep(3, 4, "next")).toBe(0);
    expect(strataFindStep(0, 4, "previous")).toBe(3);
  });

  it("stays put with one match", () => {
    expect(strataFindStep(0, 1, "next")).toBe(0);
    expect(strataFindStep(0, 1, "previous")).toBe(0);
  });

  it("has nowhere to go without matches", () => {
    expect(strataFindStep(0, 0, "next")).toBeNull();
  });
});
