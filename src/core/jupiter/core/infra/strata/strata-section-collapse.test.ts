import { describe, expect, it } from "vitest";

import {
  strataSectionCollapsed,
  strataSetSectionCollapsed,
  strataToggleSectionCollapsed,
} from "#/core/infra/strata/strata-section-collapse";

const NONE = { collapsed: [], expanded: [] };

describe("strataSectionCollapsed", () => {
  it("is open for a section that starts open, until it is in collapsed", () => {
    expect(strataSectionCollapsed(NONE, "note", false)).toBe(false);
    expect(
      strataSectionCollapsed(
        { collapsed: ["note"], expanded: [] },
        "note",
        false,
      ),
    ).toBe(true);
  });

  it("is collapsed for a section that starts collapsed, until it is in expanded", () => {
    expect(strataSectionCollapsed(NONE, "history", true)).toBe(true);
    expect(
      strataSectionCollapsed(
        { collapsed: [], expanded: ["history"] },
        "history",
        true,
      ),
    ).toBe(false);
  });

  it("ignores the list that is not its own", () => {
    expect(
      strataSectionCollapsed(
        { collapsed: ["history"], expanded: [] },
        "history",
        true,
      ),
    ).toBe(true);
    expect(
      strataSectionCollapsed(
        { collapsed: [], expanded: ["note"] },
        "note",
        false,
      ),
    ).toBe(false);
  });
});

describe("strataToggleSectionCollapsed", () => {
  it("collapses a section that starts open by listing it", () => {
    expect(strataToggleSectionCollapsed(NONE, "note", false)).toEqual({
      collapsed: ["note"],
      expanded: [],
    });
  });

  it("expands a section that starts collapsed by listing it", () => {
    expect(strataToggleSectionCollapsed(NONE, "history", true)).toEqual({
      collapsed: [],
      expanded: ["history"],
    });
  });

  it("goes back to nothing listed, so a link stays short", () => {
    const open = strataToggleSectionCollapsed(NONE, "history", true);
    expect(strataToggleSectionCollapsed(open, "history", true)).toEqual(NONE);
    const shut = strataToggleSectionCollapsed(NONE, "note", false);
    expect(strataToggleSectionCollapsed(shut, "note", false)).toEqual(NONE);
  });

  it("leaves the other sections as they are", () => {
    const state = { collapsed: ["a"], expanded: ["b"] };
    expect(strataToggleSectionCollapsed(state, "history", true)).toEqual({
      collapsed: ["a"],
      expanded: ["b", "history"],
    });
  });
});

describe("strataSetSectionCollapsed", () => {
  it("does nothing to a section that is already so", () => {
    expect(strataSetSectionCollapsed(NONE, "history", true, true)).toEqual(
      NONE,
    );
    expect(strataSetSectionCollapsed(NONE, "note", false, false)).toEqual(NONE);
  });

  it("opens a section that starts collapsed, which is what a chip does", () => {
    expect(strataSetSectionCollapsed(NONE, "history", true, false)).toEqual({
      collapsed: [],
      expanded: ["history"],
    });
  });
});
