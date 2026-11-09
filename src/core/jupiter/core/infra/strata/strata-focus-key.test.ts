import { describe, expect, it } from "vitest";

import {
  strataFocusStep,
  type StrataKeyEvent,
} from "#/core/infra/strata/strata-focus-key";

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
    expect(strataFocusStep(key("h"), false)).toBe(-1);
    expect(strataFocusStep(key("l"), false)).toBe(1);
  });

  it("ignores other keys", () => {
    expect(strataFocusStep(key("j"), false)).toBeNull();
    expect(strataFocusStep(key("Escape"), false)).toBeNull();
  });

  it("ignores keys typed into a field", () => {
    expect(strataFocusStep(key("h"), true)).toBeNull();
  });

  it("ignores keys with a modifier, such as the shortcuts of the browser", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(strataFocusStep(key("l", extra), false)).toBeNull();
    }
  });

  it("ignores a key something else already handled", () => {
    expect(
      strataFocusStep(key("l", { defaultPrevented: true }), false),
    ).toBeNull();
  });
});
