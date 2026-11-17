import { describe, expect, it } from "vitest";

import { strataCommandSearchKeyAction } from "#/core/infra/strata/strata-command-search-key";
import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

const press = (
  key: string,
  extra: Partial<StrataKeyEvent> = {},
): StrataKeyEvent => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  defaultPrevented: false,
  ...extra,
});

describe("strataCommandSearchKeyAction", () => {
  it("types any character: letters, digits, space, punctuation", () => {
    expect(strataCommandSearchKeyAction(press("a"))).toEqual({
      kind: "type",
      text: "a",
    });
    expect(
      strataCommandSearchKeyAction(press("A", { shiftKey: true })),
    ).toEqual({
      kind: "type",
      text: "A",
    });
    expect(strataCommandSearchKeyAction(press("7"))).toEqual({
      kind: "type",
      text: "7",
    });
    expect(strataCommandSearchKeyAction(press(" "))).toEqual({
      kind: "type",
      text: " ",
    });
    expect(strataCommandSearchKeyAction(press("-"))).toEqual({
      kind: "type",
      text: "-",
    });
  });

  it("moves with the arrows and toggles with enter", () => {
    expect(strataCommandSearchKeyAction(press("ArrowDown"))).toEqual({
      kind: "move",
      by: 1,
    });
    expect(strataCommandSearchKeyAction(press("ArrowUp"))).toEqual({
      kind: "move",
      by: -1,
    });
    expect(strataCommandSearchKeyAction(press("Enter"))).toEqual({
      kind: "toggle",
    });
  });

  it("takes back with backspace and leaves with escape", () => {
    expect(strataCommandSearchKeyAction(press("Backspace"))).toEqual({
      kind: "back",
    });
    expect(strataCommandSearchKeyAction(press("Escape"))).toEqual({
      kind: "exit",
    });
  });

  it("lets a shortcut of the browser go on", () => {
    expect(strataCommandSearchKeyAction(press("r", { metaKey: true }))).toEqual(
      { kind: "leave" },
    );
    expect(strataCommandSearchKeyAction(press("F5"))).toEqual({
      kind: "leave",
    });
  });

  it("holds back a key that types nothing", () => {
    expect(strataCommandSearchKeyAction(press("Shift"))).toEqual({
      kind: "ignore",
    });
    expect(strataCommandSearchKeyAction(press("Tab"))).toEqual({
      kind: "ignore",
    });
  });
});
