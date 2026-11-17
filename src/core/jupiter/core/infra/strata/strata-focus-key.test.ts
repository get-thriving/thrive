import { describe, expect, it } from "vitest";

import {
  strataFocusStep,
  type StrataKeyEvent,
} from "#/core/infra/strata/strata-focus-key";
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

describe("strataFocusStep", () => {
  it("moves left on h and right on l", () => {
    expect(strataFocusStep(key("h"), false, DEFAULTS)).toBe(-1);
    expect(strataFocusStep(key("l"), false, DEFAULTS)).toBe(1);
  });

  it("ignores other keys", () => {
    expect(strataFocusStep(key("j"), false, DEFAULTS)).toBeNull();
    expect(strataFocusStep(key("Escape"), false, DEFAULTS)).toBeNull();
  });

  it("ignores keys typed into a field", () => {
    expect(strataFocusStep(key("h"), true, DEFAULTS)).toBeNull();
  });

  it("ignores keys with a modifier, such as the shortcuts of the browser", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(strataFocusStep(key("l", extra), false, DEFAULTS)).toBeNull();
    }
  });

  it("ignores a key something else already handled", () => {
    expect(
      strataFocusStep(key("l", { defaultPrevented: true }), false, DEFAULTS),
    ).toBeNull();
  });
});
