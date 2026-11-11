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
  it("splits on c", () => {
    expect(strataSplitKeyAction(key("c"), false)).toBe("split");
  });

  it("folds back on shift c", () => {
    expect(strataSplitKeyAction(key("C", { shiftKey: true }), false)).toBe(
      "fold",
    );
  });

  it("ignores other keys", () => {
    expect(strataSplitKeyAction(key("s"), false)).toBeNull();
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(strataSplitKeyAction(key("c"), true)).toBeNull();
  });

  it("leaves a key that something else took", () => {
    expect(
      strataSplitKeyAction(key("c", { defaultPrevented: true }), false),
    ).toBeNull();
  });

  it("ignores c with a modifier, so copy stays copy", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(strataSplitKeyAction(key("c", extra), false)).toBeNull();
    }
  });
});
