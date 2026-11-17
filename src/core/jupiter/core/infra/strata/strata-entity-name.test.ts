import { describe, expect, it } from "vitest";

import { strataEntityName } from "#/core/infra/strata/strata-entity-name";

describe("strataEntityName", () => {
  it("finds the entity with the ref id among what a loader returned", () => {
    expect(
      strataEntityName(
        {
          allTags: [{ ref_id: "3", name: "A tag" }],
          habit: { ref_id: "3", name: "Buy milk" },
        },
        "3",
      ),
    ).toBe("Buy milk");
  });

  it("looks one level in, for an entity inside a result", () => {
    expect(
      strataEntityName(
        { result: { timePlan: { ref_id: "7", name: "Week 3" } } },
        "7",
      ),
    ).toBe("Week 3");
  });

  it("takes a title when there is no name", () => {
    expect(
      strataEntityName({ note: { ref_id: "2", title: "Ideas" } }, "2"),
    ).toBe("Ideas");
  });

  it("compares ids as text, and ignores other entities and lists", () => {
    expect(
      strataEntityName({ habit: { ref_id: 3, name: "Number" } }, "3"),
    ).toBe("Number");
    expect(
      strataEntityName({ habit: { ref_id: "4", name: "Other" } }, "3"),
    ).toBe(null);
    expect(
      strataEntityName({ habits: [{ ref_id: "3", name: "In a list" }] }, "3"),
    ).toBe(null);
  });

  it("is null for a blank name, no data and no id", () => {
    expect(strataEntityName({ habit: { ref_id: "3", name: "  " } }, "3")).toBe(
      null,
    );
    expect(strataEntityName(undefined, "3")).toBeNull();
    expect(
      strataEntityName({ habit: { ref_id: "3", name: "A" } }, ""),
    ).toBeNull();
  });
});
