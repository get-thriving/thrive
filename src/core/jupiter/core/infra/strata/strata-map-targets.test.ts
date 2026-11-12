import { describe, expect, it } from "vitest";

import type { StrataMapColumn } from "#/core/infra/strata/strata-map-column";
import { strataMapTargets } from "#/core/infra/strata/strata-map-targets";

const column = (key: string, sections: string[]): StrataMapColumn => ({
  key,
  label: key,
  subject: 0,
  focused: false,
  state: "full",
  sections: sections.map((id) => ({ id, title: id })),
});

describe("strataMapTargets", () => {
  it("has none for no columns", () => {
    expect(strataMapTargets([])).toEqual([]);
  });

  it("is a column with no sections just the column", () => {
    expect(strataMapTargets([column("list", [])])).toEqual([
      { kind: "column", columnKey: "list" },
    ]);
  });

  it("puts the sections of a column right after it", () => {
    expect(
      strataMapTargets([column("list", []), column("detail", ["a", "b"])]),
    ).toEqual([
      { kind: "column", columnKey: "list" },
      { kind: "column", columnKey: "detail" },
      { kind: "section", columnKey: "detail", sectionId: "a" },
      { kind: "section", columnKey: "detail", sectionId: "b" },
    ]);
  });
});
