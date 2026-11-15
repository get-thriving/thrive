import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataFindKeyAction } from "#/core/infra/strata/strata-find-key";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";

const DEFAULTS = strataKeyBindingsFrom(undefined);

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

describe("strataFindKeyAction, closed", () => {
  it("opens on f", () => {
    expect(strataFindKeyAction(key("f"), false, false, DEFAULTS)).toBe("open");
  });

  it("does not open on shift f", () => {
    expect(
      strataFindKeyAction(key("F", { shiftKey: true }), false, false, DEFAULTS),
    ).toBeNull();
  });

  it("ignores other keys, n and Enter included", () => {
    for (const name of ["/", "n", "N", "Escape", "Enter", "g"]) {
      expect(strataFindKeyAction(key(name), false, false, DEFAULTS)).toBeNull();
    }
  });

  it("leaves f to a field, a dialog or a menu", () => {
    expect(strataFindKeyAction(key("f"), false, true, DEFAULTS)).toBeNull();
  });

  it("leaves a key that something else took", () => {
    expect(
      strataFindKeyAction(
        key("f", { defaultPrevented: true }),
        false,
        false,
        DEFAULTS,
      ),
    ).toBeNull();
  });
});

describe("strataFindKeyAction, open", () => {
  it("goes to the match on Enter, steps on the arrows and cancels on Escape", () => {
    expect(strataFindKeyAction(key("Enter"), true, true, DEFAULTS)).toBe(
      "commit",
    );
    expect(strataFindKeyAction(key("ArrowDown"), true, true, DEFAULTS)).toBe(
      "next",
    );
    expect(strataFindKeyAction(key("ArrowUp"), true, true, DEFAULTS)).toBe(
      "previous",
    );
    expect(strataFindKeyAction(key("Escape"), true, true, DEFAULTS)).toBe(
      "cancel",
    );
  });

  it("leaves every other key to be typed, f and n included", () => {
    for (const name of ["f", "/", "n", "N", "a", "Backspace"]) {
      expect(strataFindKeyAction(key(name), true, true, DEFAULTS)).toBeNull();
    }
  });
});

describe("strataFindKeyAction, with a modifier", () => {
  it("ignores a key with ctrl, meta or alt held", () => {
    for (const open of [false, true]) {
      for (const extra of [
        { ctrlKey: true },
        { metaKey: true },
        { altKey: true },
      ]) {
        expect(
          strataFindKeyAction(key("f", extra), open, false, DEFAULTS),
        ).toBeNull();
        expect(
          strataFindKeyAction(key("Enter", extra), open, true, DEFAULTS),
        ).toBeNull();
      }
    }
  });
});
