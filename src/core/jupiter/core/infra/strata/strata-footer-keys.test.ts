import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import { strataFooterKeys } from "#/core/infra/strata/strata-footer-keys";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";

const DEFAULTS = strataKeyBindingsFrom(undefined);

const quiet: StrataKeysContext = {
  overlay: null,
  typing: null,
  focus: "column",
  columns: 1,
  split: false,
  sections: 0,
  collapsible: false,
  splittable: false,
  items: 0,
  editable: false,
  targets: 0,
  scrolls: false,
  position: false,
  menu: false,
  commands: false,
  closable: true,
};

/** The keys, one string each, such as `"h l columns"`. */
function listed(overrides: Partial<StrataKeysContext>): string[] {
  return strataFooterKeys({ ...quiet, ...overrides }, DEFAULTS).map((entry) =>
    [...entry.keys, entry.label].join(" "),
  );
}

describe("strataFooterKeys", () => {
  it("lists only the keys that work everywhere on a lone, bare column", () => {
    expect(listed({})).toEqual([
      "s hints",
      "n new",
      "q apps",
      "f find",
      "esc close",
    ]);
  });

  it("offers h and l only with another column to go to", () => {
    expect(listed({ columns: 1 })).not.toContain("h l columns");
    expect(listed({ columns: 2 })[0]).toBe("h l columns");
  });

  it("offers the top and the bottom only on a column that scrolls", () => {
    expect(listed({ scrolls: false })).not.toContain("⇧k ⇧j top bottom");
    expect(listed({ scrolls: true })).toEqual([
      "s hints",
      "n new",
      "q apps",
      "f find",
      "⇧k ⇧j top bottom",
      "esc close",
    ]);
  });

  it("offers o and p only on an item with a place in a collection", () => {
    expect(listed({ position: false })).not.toContain("o p prev next");
    expect(listed({ position: true })).toEqual([
      "s hints",
      "n new",
      "q apps",
      "f find",
      "o p prev next",
      "esc close",
    ]);
  });

  it("offers the menu only on a column that has one", () => {
    expect(listed({ menu: false })).not.toContain(". menu");
    expect(listed({ menu: true })).toEqual([
      "s hints",
      "n new",
      "q apps",
      "f find",
      ". menu",
      "esc close",
    ]);
  });

  it("offers the commands only on a column that has some", () => {
    expect(listed({ commands: false })).not.toContain("x commands");
    expect(listed({ commands: true })).toEqual([
      "s hints",
      "x commands",
      "n new",
      "q apps",
      "f find",
      "esc close",
    ]);
  });

  it("says how to use the menu of commands while it is open", () => {
    expect(listed({ overlay: "commands", commands: true })).toEqual([
      "type a label to run it",
      "⌫ back",
      "esc cancel",
    ]);
  });

  it("says how to search the choices of a filter while the menu is on them", () => {
    expect(listed({ overlay: "commands-search", commands: true })).toEqual([
      "type to search",
      "↑ ↓ choices",
      "↵ turn on or off",
      "⌫ back",
      "esc list",
    ]);
  });

  it("offers escape to close only on a column that can be closed", () => {
    expect(listed({ closable: false })).toEqual([
      "s hints",
      "n new",
      "q apps",
      "f find",
    ]);
  });

  it("still goes back with escape from an item of a column that cannot close", () => {
    expect(
      listed({ focus: "item", sections: 0, items: 3, closable: false }),
    ).toContain("esc back");
  });

  it("offers e to edit a note on a section or a column that has one and no list", () => {
    const section = { focus: "section" as const, sections: 3 };
    expect(listed({ ...section, editable: true })).toContain("e edit");
    // A list comes first: `e` goes into its items.
    expect(listed({ ...section, editable: true, items: 3 })).not.toContain(
      "e edit",
    );
    expect(listed({ ...section, editable: false })).not.toContain("e edit");
    // A split column with a note has no section of its own to put the focus on.
    expect(listed({ split: true, editable: true })).toContain("e edit");
    expect(listed({ split: true, editable: true, items: 2 })).not.toContain(
      "e edit",
    );
  });

  it("offers the map only with two places to jump to", () => {
    expect(listed({ targets: 1 })).not.toContain("a map");
    expect(listed({ targets: 2 })).toContain("a map");
  });

  it("offers only j and k on a column with a stack of sections and none focused", () => {
    // Collapse and split act on the section the focus is in, so with none
    // there is nothing for them to act on, even if the sections allow them.
    expect(
      listed({ sections: 3, collapsible: true, splittable: true }),
    ).toEqual([
      "j k sections",
      "s hints",
      "n new",
      "q apps",
      "f find",
      "esc close",
    ]);
  });

  it("goes into a section with enter, and into its list with e when it has one", () => {
    const section = { focus: "section" as const, sections: 3 };
    expect(listed({ ...section, items: 0 })).not.toContain("e items");
    expect(
      listed({ ...section, items: 4, collapsible: true, splittable: true }),
    ).toEqual([
      "j k sections",
      "↵ go in",
      "e items",
      "z collapse",
      "c split",
      "s hints",
      "n new",
      "q apps",
      "f find",
      "esc close",
    ]);
  });

  it("offers collapse and split only where the section the focus is in allows them", () => {
    const section = { focus: "section" as const, sections: 3, items: 4 };
    // The fixed first section can be neither collapsed nor split out.
    expect(listed({ ...section })).toEqual([
      "j k sections",
      "↵ go in",
      "e items",
      "s hints",
      "n new",
      "q apps",
      "f find",
      "esc close",
    ]);
    // A section with nothing to fill a column can be collapsed, not split.
    expect(listed({ ...section, collapsible: true })).toContain("z collapse");
    expect(listed({ ...section, collapsible: true })).not.toContain("c split");
    expect(listed({ ...section, splittable: true })).toContain("c split");
    expect(listed({ ...section, splittable: true })).not.toContain(
      "z collapse",
    );
  });

  it("moves between items and opens one, and escape goes back", () => {
    expect(listed({ focus: "item", sections: 3, items: 4 })).toEqual([
      "j k items",
      "↵ open",
      "s hints",
      "n new",
      "q apps",
      "f find",
      "esc back",
    ]);
  });

  it("goes into the list of a column that has no sections with j and k", () => {
    expect(listed({ items: 5 })).toEqual([
      "j k items",
      "s hints",
      "n new",
      "q apps",
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

  it("draws the keys the user chose, not the defaults", () => {
    const chosen = strataKeyBindingsFrom({
      [KeyboardAction.COLUMN_PREVIOUS]: "Ctrl+ArrowLeft",
      [KeyboardAction.COLUMN_NEXT]: "Ctrl+ArrowRight",
      [KeyboardAction.HINTS]: "g",
      [KeyboardAction.FIND]: "/",
      [KeyboardAction.CLOSE]: "x",
      [KeyboardAction.APPS]: "o",
    });
    expect(
      strataFooterKeys({ ...quiet, columns: 2 }, chosen).map((entry) =>
        [...entry.keys, entry.label].join(" "),
      ),
    ).toEqual([
      "⌃← ⌃→ columns",
      "g hints",
      "n new",
      "o apps",
      "/ find",
      "x close",
    ]);
  });

  it("keeps the keys of a mode and a field as they are", () => {
    const chosen = strataKeyBindingsFrom({ [KeyboardAction.CLOSE]: "x" });
    expect(
      strataFooterKeys({ ...quiet, typing: "field" }, chosen).map(
        (entry) => entry.keys[0],
      ),
    ).toEqual(["esc"]);
    const hints = strataFooterKeys({ ...quiet, overlay: "hints" }, chosen);
    expect(hints[hints.length - 1].keys).toEqual(["esc"]);
  });

  it("says how to use the menu of new items and how to leave it", () => {
    expect(listed({ overlay: "new" })).toEqual([
      "type a label to start it",
      "⌫ back",
      "esc cancel",
    ]);
  });

  it("says how to use the menu of apps and how to leave it", () => {
    expect(listed({ overlay: "apps" })).toEqual([
      "type a label to go there",
      "⌫ back",
      "esc cancel",
    ]);
  });
});
