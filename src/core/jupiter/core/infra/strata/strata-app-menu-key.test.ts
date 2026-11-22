import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  isStrataAppMenuEnterKey,
  strataAppMenuKeyAction,
} from "#/core/infra/strata/strata-app-menu-key";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";

const DEFAULTS = strataKeyBindingsFrom(undefined);

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

describe("isStrataAppMenuEnterKey", () => {
  it("opens on q", () => {
    expect(isStrataAppMenuEnterKey(press("q"), false, DEFAULTS)).toBe(true);
  });

  it("opens on the key the user chose, and no longer on q", () => {
    const chosen = strataKeyBindingsFrom({ [KeyboardAction.APPS]: "g" });
    expect(isStrataAppMenuEnterKey(press("g"), false, chosen)).toBe(true);
    expect(isStrataAppMenuEnterKey(press("q"), false, chosen)).toBe(false);
  });

  it("stays out of fields and of what something else took", () => {
    expect(isStrataAppMenuEnterKey(press("q"), true, DEFAULTS)).toBe(false);
    expect(
      isStrataAppMenuEnterKey(
        press("q", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores q with a modifier", () => {
    expect(
      isStrataAppMenuEnterKey(press("q", { ctrlKey: true }), false, DEFAULTS),
    ).toBe(false);
  });
});

describe("strataAppMenuKeyAction", () => {
  it("takes any letter, as a letter", () => {
    expect(strataAppMenuKeyAction(press("t"))).toEqual({
      kind: "letter",
      letter: "t",
      shift: false,
    });
    expect(strataAppMenuKeyAction(press("Z", { shiftKey: true }))).toEqual({
      kind: "letter",
      letter: "z",
      shift: true,
    });
  });

  it("leaves on Escape, and goes back on Backspace", () => {
    expect(strataAppMenuKeyAction(press("Escape"))).toEqual({ kind: "exit" });
    expect(strataAppMenuKeyAction(press("Backspace"))).toEqual({
      kind: "back",
    });
  });

  it("leaves for a shortcut of the browser", () => {
    expect(strataAppMenuKeyAction(press("r", { metaKey: true }))).toEqual({
      kind: "leave",
    });
    expect(strataAppMenuKeyAction(press("F5"))).toEqual({ kind: "leave" });
  });

  it("holds back anything else", () => {
    expect(strataAppMenuKeyAction(press("3"))).toEqual({ kind: "ignore" });
    expect(strataAppMenuKeyAction(press("Enter"))).toEqual({ kind: "ignore" });
  });
});
