import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataSplitKeyAction } from "#/core/infra/strata/strata-split-key";

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

describe("strataSplitKeyAction", () => {
  it("splits on s", () => {
    expect(strataSplitKeyAction(key("s"), false)).toBe("split");
  });

  it("folds back on shift s", () => {
    expect(strataSplitKeyAction(key("S", { shiftKey: true }), false)).toBe(
      "fold",
    );
  });

  it("ignores other keys", () => {
    expect(strataSplitKeyAction(key("x"), false)).toBeNull();
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(strataSplitKeyAction(key("s"), true)).toBeNull();
  });

  it("leaves a key that something else took", () => {
    expect(
      strataSplitKeyAction(key("s", { defaultPrevented: true }), false),
    ).toBeNull();
  });

  it("ignores s with a modifier, so save stays save", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(strataSplitKeyAction(key("s", extra), false)).toBeNull();
    }
  });
});
