import { describe, expect, it } from "vitest";

import { strataEntityTitle } from "#/core/infra/strata/strata-entity-title";

describe("strataEntityTitle", () => {
  it("names the kind and the number", () => {
    expect(strataEntityTitle("Habit", "344")).toBe("Habit #344");
  });

  it("splits a kind of several words", () => {
    expect(strataEntityTitle("TimePlan", "4356")).toBe("Time Plan #4356");
    expect(strataEntityTitle("TimePlanActivity", "7")).toBe(
      "Time Plan Activity #7",
    );
  });
});
