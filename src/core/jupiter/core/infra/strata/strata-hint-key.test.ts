import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  isStrataHintEnterKey,
  strataHintKeyAction,
} from "#/core/infra/strata/strata-hint-key";

const key = (
  name: string,
  extra: Partial<StrataKeyEvent> = {},
): StrataKeyEvent => ({
  key: name,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  defaultPrevented: false,
  ...extra,
});

describe("isStrataHintEnterKey", () => {
  it("enters hint mode on s", () => {
    expect(isStrataHintEnterKey(key("s"), false)).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isStrataHintEnterKey(key("g"), false)).toBe(false);
  });

  it("leaves s to a field, a dialog or a menu", () => {
    expect(isStrataHintEnterKey(key("s"), true)).toBe(false);
  });

  it("leaves a key that something else took", () => {
    expect(
      isStrataHintEnterKey(key("s", { defaultPrevented: true }), false),
    ).toBe(false);
  });

  it("ignores s with a modifier", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(isStrataHintEnterKey(key("s", extra), false)).toBe(false);
    }
  });
});

describe("strataHintKeyAction", () => {
  it("takes the letters of the alphabet, whatever their case", () => {
    expect(strataHintKeyAction(key("d"))).toEqual({
      kind: "letter",
      letter: "d",
    });
    expect(strataHintKeyAction(key("D", { shiftKey: true }))).toEqual({
      kind: "letter",
      letter: "d",
    });
  });

  it("takes s as a letter too, so Escape is the way out", () => {
    expect(strataHintKeyAction(key("s"))).toEqual({
      kind: "letter",
      letter: "s",
    });
  });

  it("leaves on Escape and takes a letter back on Backspace", () => {
    expect(strataHintKeyAction(key("Escape"))).toEqual({ kind: "exit" });
    expect(strataHintKeyAction(key("Backspace"))).toEqual({ kind: "back" });
  });

  it("holds back the keys that are no label", () => {
    for (const name of ["Tab", "Enter", " ", "ArrowDown", "1", "q", "Shift"]) {
      expect(strataHintKeyAction(key(name))).toEqual({ kind: "ignore" });
    }
  });

  it("lets a shortcut go on, and leaves the mode", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(strataHintKeyAction(key("k", extra))).toEqual({ kind: "leave" });
    }
    expect(strataHintKeyAction(key("F5"))).toEqual({ kind: "leave" });
  });
});
