import { describe, expect, it } from "vitest";

import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import { strataMakeCommand } from "#/core/infra/component/layout/strata-make-command";
import {
  STRATA_MENU_GROUP_TITLE,
  strataCommandGroups,
} from "#/core/infra/component/layout/strata-command-groups";

const make = (id: string): StrataCommand =>
  strataMakeCommand({
    id,
    label: id,
    kind: StrataCommandKind.ACTION,
    run: () => undefined,
  });

const ids = (groups: ReturnType<typeof strataCommandGroups>) =>
  groups.map((group) => [group.title, group.commands.map((c) => c.id)]);

const layout = (id: string): StrataCommand =>
  strataMakeCommand({
    id,
    label: id,
    kind: StrataCommandKind.LAYOUT,
    run: () => undefined,
  });

const position = (id: string): StrataCommand =>
  strataMakeCommand({
    id,
    label: id,
    kind: StrataCommandKind.POSITION,
    run: () => undefined,
  });

const entry = (id: string, ruleBefore = false): StrataCommand =>
  strataMakeCommand({
    id,
    label: id,
    kind: StrataCommandKind.MENU,
    ruleBefore,
    run: () => undefined,
  });

const ruled = (groups: ReturnType<typeof strataCommandGroups>) =>
  groups.map((group) =>
    group.commands.filter((c) => c.ruleBefore).map((c) => c.id),
  );

describe("strataCommandGroups", () => {
  it("puts the way along the collection first in the menu, then a rule", () => {
    const groups = strataCommandGroups([
      {
        title: "Habit",
        commands: [
          make("new"),
          position("previous"),
          position("next"),
          entry("history"),
          entry("access"),
          entry("archive", true),
          entry("remove"),
        ],
      },
    ]);
    expect(ids(groups)).toEqual([
      ["Habit", ["new"]],
      [
        STRATA_MENU_GROUP_TITLE,
        ["previous", "next", "history", "access", "archive", "remove"],
      ],
    ]);
    // Between the way along and the entries, and before what destroys.
    expect(ruled(groups)).toEqual([[], ["history", "archive"]]);
  });

  it("has a menu of the way along alone, with no rule", () => {
    const groups = strataCommandGroups([
      { title: "Habit", commands: [position("previous"), position("next")] },
    ]);
    expect(ids(groups)).toEqual([
      [STRATA_MENU_GROUP_TITLE, ["previous", "next"]],
    ]);
    expect(ruled(groups)).toEqual([[]]);
  });

  it("sets the layout of a section apart from its actions by a rule", () => {
    const groups = strataCommandGroups([
      { title: "Notes", commands: [layout("collapse"), layout("split")] },
      { title: "Notes", commands: [make("add"), make("tidy")] },
      { title: "Tags", commands: [layout("expand")] },
    ]);
    expect(ruled(groups)).toEqual([["collapse"], []]);
  });

  it("puts the commands that lay a section out last under its title", () => {
    expect(
      ids(
        strataCommandGroups([
          { title: "Notes", commands: [layout("collapse"), layout("split")] },
          { title: "Notes", commands: [make("add"), make("tidy")] },
          { title: "Tags", commands: [layout("expand")] },
        ]),
      ),
    ).toEqual([
      ["Notes", ["add", "tidy", "collapse", "split"]],
      ["Tags", ["expand"]],
    ]);
  });

  it("puts sources of the same title that follow each other in one group", () => {
    expect(
      ids(
        strataCommandGroups([
          { title: "Notes", commands: [make("a")] },
          { title: "Notes", commands: [make("b")] },
          { title: "Tags", commands: [make("c")] },
        ]),
      ),
    ).toEqual([
      ["Notes", ["a", "b"]],
      ["Tags", ["c"]],
    ]);
  });

  it("leaves out a source with nothing to run, and joins what it separated", () => {
    expect(
      ids(
        strataCommandGroups([
          { title: "Notes", commands: [make("a")] },
          { title: "Tags", commands: [] },
          { title: "Notes", commands: [make("b")] },
        ]),
      ),
    ).toEqual([["Notes", ["a", "b"]]]);
  });

  it("keeps a title that comes back after another as a group of its own", () => {
    expect(
      ids(
        strataCommandGroups([
          { title: "Notes", commands: [make("a")] },
          { title: "Tags", commands: [make("b")] },
          { title: "Notes", commands: [make("c")] },
        ]),
      ),
    ).toEqual([
      ["Notes", ["a"]],
      ["Tags", ["b"]],
      ["Notes", ["c"]],
    ]);
  });

  it("gives nothing when no source has a command", () => {
    expect(strataCommandGroups([])).toEqual([]);
    expect(strataCommandGroups([{ title: "Notes", commands: [] }])).toEqual([]);
  });

  it("keeps the entries of the menu apart from the actions, in a group at the end", () => {
    const menuEntry = (id: string): StrataCommand =>
      strataMakeCommand({
        id,
        label: id,
        kind: StrataCommandKind.MENU,
        run: () => undefined,
      });
    const groups = strataCommandGroups([
      // The header of the column has an action and menu entries.
      { title: "Habits", commands: [make("new"), menuEntry("history")] },
      { title: "Habits", commands: [make("toolbar")] },
      { title: "Tags", commands: [make("add")] },
      { title: "Habits", commands: [menuEntry("archive")] },
    ]);
    expect(ids(groups)).toEqual([
      ["Habits", ["new", "toolbar"]],
      ["Tags", ["add"]],
      [STRATA_MENU_GROUP_TITLE, ["history", "archive"]],
    ]);
    expect(groups.map((group) => group.menu)).toEqual([false, false, true]);
  });

  it("makes a group of the menu even when it is all the column has", () => {
    const menuEntry = strataMakeCommand({
      id: "archive",
      label: "Archive…",
      kind: StrataCommandKind.MENU,
      run: () => undefined,
    });
    expect(
      ids(strataCommandGroups([{ title: "Habit", commands: [menuEntry] }])),
    ).toEqual([[STRATA_MENU_GROUP_TITLE, ["archive"]]]);
  });
});
