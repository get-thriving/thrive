import { describe, expect, it } from "vitest";

import { strataSegmentColumns } from "#/core/infra/strata/strata-segment-columns";

describe("strataSegmentColumns", () => {
  it("gives each part to the first panel whose URL reaches it", () => {
    expect(strataSegmentColumns([2, 3], 3)).toEqual([0, 0, 1]);
    expect(strataSegmentColumns([2, 3, 5], 5)).toEqual([0, 0, 1, 2, 2]);
  });

  it("gives parts past the last panel's URL to the last panel", () => {
    expect(strataSegmentColumns([1], 3)).toEqual([0, 0, 0]);
  });

  it("has no column without panels", () => {
    expect(strataSegmentColumns([], 2)).toEqual([-1, -1]);
  });

  it("is empty without parts", () => {
    expect(strataSegmentColumns([2], 0)).toEqual([]);
  });
});
