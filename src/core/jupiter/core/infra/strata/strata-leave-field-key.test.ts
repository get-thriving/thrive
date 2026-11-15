import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { isStrataLeaveFieldKey } from "#/core/infra/strata/strata-leave-field-key";

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

describe("isStrataLeaveFieldKey", () => {
  it("leaves a field on Escape", () => {
    expect(isStrataLeaveFieldKey(key("Escape"), true)).toBe(true);
  });

  it("ignores other keys", () => {
    expect(isStrataLeaveFieldKey(key("q"), true)).toBe(false);
    expect(isStrataLeaveFieldKey(key("Enter"), true)).toBe(false);
  });

  it("leaves Escape alone outside a field, where it closes the column", () => {
    expect(isStrataLeaveFieldKey(key("Escape"), false)).toBe(false);
  });

  it("leaves Escape that something else took, like open suggestions", () => {
    expect(
      isStrataLeaveFieldKey(key("Escape", { defaultPrevented: true }), true),
    ).toBe(false);
  });

  it("ignores Escape with a modifier", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(isStrataLeaveFieldKey(key("Escape", extra), true)).toBe(false);
    }
  });
});
