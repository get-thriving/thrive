import { describe, expect, it } from "vitest";

import { countSummary } from "#/core/infra/component/count-summary";

describe("countSummary", () => {
  it("says none for zero", () => {
    expect(countSummary(0, "task", "tasks")).toBe("none");
  });

  it("uses the singular for one", () => {
    expect(countSummary(1, "task", "tasks")).toBe("1 task");
  });

  it("uses the plural for many", () => {
    expect(countSummary(3, "activity", "activities")).toBe("3 activities");
  });
});
