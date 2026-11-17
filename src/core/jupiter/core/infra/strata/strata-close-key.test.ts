import { describe, expect, it } from "vitest";

import { isStrataCloseKey } from "#/core/infra/strata/strata-close-key";
import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
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

describe("isStrataCloseKey", () => {
  it("closes on Escape", () => {
    expect(isStrataCloseKey(key("Escape"), false, DEFAULTS)).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isStrataCloseKey(key("q"), false, DEFAULTS)).toBe(false);
    expect(isStrataCloseKey(key("Enter"), false, DEFAULTS)).toBe(false);
  });

  it("leaves Escape to a field, a dialog or a menu", () => {
    expect(isStrataCloseKey(key("Escape"), true, DEFAULTS)).toBe(false);
  });

  it("leaves Escape that something else took", () => {
    expect(
      isStrataCloseKey(
        key("Escape", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores Escape with a modifier", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(isStrataCloseKey(key("Escape", extra), false, DEFAULTS)).toBe(
        false,
      );
    }
  });
});
