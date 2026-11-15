import { describe, expect, it } from "vitest";

import { isStrataCollapseKey } from "#/core/infra/strata/strata-collapse-key";
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

describe("isStrataCollapseKey", () => {
  it("collapses on z", () => {
    expect(isStrataCollapseKey(key("z"), false, DEFAULTS)).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isStrataCollapseKey(key("x"), false, DEFAULTS)).toBe(false);
    expect(
      isStrataCollapseKey(key("Z", { shiftKey: true }), false, DEFAULTS),
    ).toBe(false);
  });

  it("leaves z to a field, a dialog or a menu", () => {
    expect(isStrataCollapseKey(key("z"), true, DEFAULTS)).toBe(false);
  });

  it("leaves z that something else took", () => {
    expect(
      isStrataCollapseKey(
        key("z", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores z with a modifier, so undo stays undo", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(isStrataCollapseKey(key("z", extra), false, DEFAULTS)).toBe(false);
    }
  });
});
