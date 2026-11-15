import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { isStrataMenuKey } from "#/core/infra/strata/strata-menu-key";
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

describe("isStrataMenuKey", () => {
  it("is the full stop", () => {
    expect(isStrataMenuKey(key("."), false, DEFAULTS)).toBe(true);
    expect(isStrataMenuKey(key(","), false, DEFAULTS)).toBe(false);
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(isStrataMenuKey(key("."), true, DEFAULTS)).toBe(false);
  });

  it("leaves a key that something else took", () => {
    expect(
      isStrataMenuKey(key(".", { defaultPrevented: true }), false, DEFAULTS),
    ).toBe(false);
  });

  it("ignores it with another modifier held", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(isStrataMenuKey(key(".", extra), false, DEFAULTS)).toBe(false);
    }
  });
});
