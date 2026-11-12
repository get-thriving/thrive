import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { isStrataMapEnterKey } from "#/core/infra/strata/strata-map-key";

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

describe("isStrataMapEnterKey", () => {
  it("opens the map on a", () => {
    expect(isStrataMapEnterKey(key("a"), false)).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isStrataMapEnterKey(key("j"), false)).toBe(false);
  });

  it("leaves a with shift to whatever else wants it", () => {
    expect(isStrataMapEnterKey(key("A", { shiftKey: true }), false)).toBe(
      false,
    );
  });

  it("leaves a to a field, a dialog or a menu", () => {
    expect(isStrataMapEnterKey(key("a"), true)).toBe(false);
  });

  it("leaves a key that something else took", () => {
    expect(
      isStrataMapEnterKey(key("a", { defaultPrevented: true }), false),
    ).toBe(false);
  });

  it("leaves a shortcut of the browser or the app alone", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(isStrataMapEnterKey(key("a", extra), false)).toBe(false);
    }
  });
});
