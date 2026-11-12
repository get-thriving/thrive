import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";

const key = (
  name: string,
  extra: Partial<StrataKeyEvent> = {},
): StrataKeyEvent => ({
  key: name,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: true,
  defaultPrevented: false,
  ...extra,
});

describe("strataScrollKeyAction", () => {
  it("goes to the top on shift k and the bottom on shift j", () => {
    expect(strataScrollKeyAction(key("K"), false)).toBe("top");
    expect(strataScrollKeyAction(key("J"), false)).toBe("bottom");
  });

  it("takes the small letter too when shift is held, as with caps lock", () => {
    expect(strataScrollKeyAction(key("k"), false)).toBe("top");
    expect(strataScrollKeyAction(key("j"), false)).toBe("bottom");
  });

  it("leaves plain j and k to the sections", () => {
    expect(
      strataScrollKeyAction(key("j", { shiftKey: false }), false),
    ).toBeNull();
    expect(
      strataScrollKeyAction(key("k", { shiftKey: false }), false),
    ).toBeNull();
  });

  it("ignores other keys", () => {
    expect(strataScrollKeyAction(key("L"), false)).toBeNull();
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(strataScrollKeyAction(key("J"), true)).toBeNull();
  });

  it("leaves a key that something else took", () => {
    expect(
      strataScrollKeyAction(key("J", { defaultPrevented: true }), false),
    ).toBeNull();
  });

  it("ignores them with another modifier held", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(strataScrollKeyAction(key("J", extra), false)).toBeNull();
    }
  });
});
