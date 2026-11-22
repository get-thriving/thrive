import { describe, expect, it } from "vitest";

import {
  STRATA_MAX_UNITS,
  STRATA_MIN_UNITS,
  strataCanResize,
  strataResizedDelta,
  strataResizedSize,
} from "#/core/infra/strata/strata-column-resize";

describe("strataResizedSize", () => {
  it("is the declared size with no change", () => {
    expect(strataResizedSize(2, 0)).toBe(2);
  });

  it("moves the declared size by the delta", () => {
    expect(strataResizedSize(2, 1)).toBe(3);
    expect(strataResizedSize(3, -1)).toBe(2);
  });

  it("stays between the least and the most", () => {
    expect(strataResizedSize(3, -3)).toBe(STRATA_MIN_UNITS);
    expect(strataResizedSize(3, 9)).toBe(STRATA_MAX_UNITS);
  });

  it("never narrows a column that declares less than the least", () => {
    expect(strataResizedSize(1, -1)).toBe(1);
    expect(strataResizedSize(1, 2)).toBe(3);
  });

  it("leaves a column that is the whole screen as it is", () => {
    expect(strataResizedSize("full", 2)).toBe("full");
  });
});

describe("strataResizedDelta", () => {
  it("steps one unit at a time", () => {
    expect(strataResizedDelta(2, 0, 1)).toBe(1);
    expect(strataResizedDelta(2, 1, -1)).toBe(0);
  });

  it("stops at the least and the most", () => {
    expect(strataResizedDelta(3, -1, -1)).toBe(-1);
    expect(strataResizedDelta(2, 0, -1)).toBe(0);
    expect(strataResizedDelta(1, 0, -1)).toBe(0);
    expect(strataResizedDelta(3, STRATA_MAX_UNITS - 3, 1)).toBe(
      STRATA_MAX_UNITS - 3,
    );
  });

  it("does not move a column that is the whole screen", () => {
    expect(strataResizedDelta("full", 0, 1)).toBe(0);
  });

  it("brings back a delta that went past the limits", () => {
    expect(strataResizedDelta(3, 7, -1)).toBe(1);
  });
});

describe("strataCanResize", () => {
  it("is false at the limits, true between them", () => {
    expect(strataCanResize(2, 0, -1)).toBe(false);
    expect(strataCanResize(3, 0, -1)).toBe(true);
    expect(strataCanResize(1, 0, 1)).toBe(true);
    expect(strataCanResize(5, 0, 1)).toBe(false);
    expect(strataCanResize("full", 0, 1)).toBe(false);
  });
});
