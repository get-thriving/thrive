import { describe, expect, it } from "vitest";

import { strataFooterKeys } from "#/core/infra/strata/strata-footer-keys";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";

const quiet: StrataKeysContext = {
  overlay: null,
  typing: null,
  focus: "column",
  columns: 1,
  split: false,
  sections: 0,
  items: 0,
  targets: 0,
  scrolls: false,
};

/** The keys, one string each, such as `"h l columns"`. */
function listed(overrides: Partial<StrataKeysContext>): string[] {
  return strataFooterKeys({ ...quiet, ...overrides }).map((entry) =>
    [...entry.keys, entry.label].join(" "),
  );
}

describe("strataFooterKeys", () => {
  it("lists only the keys that work everywhere on a lone, bare column", () => {
    expect(listed({})).toEqual(["s hints", "f find", "esc close"]);
  });

  it("offers h and l only with another column to go to", () => {
    expect(listed({ columns: 1 })).not.toContain("h l columns");
    expect(listed({ columns: 2 })[0]).toBe("h l columns");
  });

  it("offers the top and the bottom only on a column that scrolls", () => {
    expect(listed({ scrolls: false })).not.toContain("⇧k ⇧j top bottom");
    expect(listed({ scrolls: true })).toEqual([
      "s hints",
      "f find",
      "⇧k ⇧j top bottom",
      "esc close",
    ]);
  });

  it("offers the map only with two places to jump to", () => {
    expect(listed({ targets: 1 })).not.toContain("a map");
    expect(listed({ targets: 2 })).toContain("a map");
  });

  it("offers j and k, collapse and split on a column with a stack of sections", () => {
    expect(listed({ sections: 3 })).toEqual([
      "j k sections",
      "z collapse",
      "c split",
      "s hints",
      "f find",
      "esc close",
    ]);
  });

  it("goes into a section with enter, and into its list with e when it has one", () => {
    const section = { focus: "section" as const, sections: 3 };
    expect(listed({ ...section, items: 0 })).not.toContain("e items");
    expect(listed({ ...section, items: 4 })).toEqual([
      "j k sections",
      "↵ go in",
      "e items",
      "z collapse",
      "c split",
      "s hints",
      "f find",
      "esc close",
    ]);
  });

  it("moves between items and opens one, and escape goes back", () => {
    expect(listed({ focus: "item", sections: 3, items: 4 })).toEqual([
      "j k items",
      "↵ open",
      "s hints",
      "f find",
      "esc back",
    ]);
  });

  it("goes into the list of a column that has no sections with j and k", () => {
    expect(listed({ items: 5 })).toEqual([
      "j k items",
      "s hints",
      "f find",
      "esc close",
    ]);
  });

  it("offers folding back on a split column, and not collapse or split", () => {
    const keys = listed({ split: true, items: 2 });
    expect(keys).toContain("⇧c fold back");
    expect(keys).toContain("j k items");
    expect(keys).not.toContain("z collapse");
    expect(keys).not.toContain("c split");
  });

  it("says how to use hint mode, and how to leave it", () => {
    expect(listed({ overlay: "hints", columns: 2, sections: 3 })).toEqual([
      "type a label to click it",
      "⌫ back",
      "esc cancel",
    ]);
  });

  it("says how to use the map, and how to leave it", () => {
    expect(listed({ overlay: "map" })).toEqual([
      "type a label to jump there",
      "⌫ back",
      "esc cancel",
    ]);
  });

  it("says how to use find, and how to leave it", () => {
    expect(listed({ overlay: "find" })).toEqual([
      "type to search",
      "↑ ↓ matches",
      "↵ go to it",
      "esc cancel",
    ]);
  });

  it("keeps the overlay's keys over the field it types in", () => {
    expect(listed({ overlay: "find", typing: "field" })[0]).toBe(
      "type to search",
    );
  });

  it("leaves only escape in a field, and in a dialog or a menu", () => {
    expect(listed({ typing: "field", sections: 3, columns: 2 })).toEqual([
      "esc leave the field",
    ]);
    expect(listed({ typing: "layer", sections: 3, columns: 2 })).toEqual([
      "esc close",
    ]);
  });
});
