import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";
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
  shiftKey: true,
  defaultPrevented: false,
  ...extra,
});

describe("strataScrollKeyAction", () => {
  it("goes to the top on shift k and the bottom on shift j", () => {
    expect(strataScrollKeyAction(key("K"), false, DEFAULTS)).toBe("top");
    expect(strataScrollKeyAction(key("J"), false, DEFAULTS)).toBe("bottom");
  });

  it("takes the small letter too when shift is held, as with caps lock", () => {
    expect(strataScrollKeyAction(key("k"), false, DEFAULTS)).toBe("top");
    expect(strataScrollKeyAction(key("j"), false, DEFAULTS)).toBe("bottom");
  });

  it("goes to the top on home and the bottom on end", () => {
    expect(
      strataScrollKeyAction(key("Home", { shiftKey: false }), false, DEFAULTS),
    ).toBe("top");
    expect(
      strataScrollKeyAction(key("End", { shiftKey: false }), false, DEFAULTS),
    ).toBe("bottom");
  });

  it("does not take home or end with shift held, which select", () => {
    expect(strataScrollKeyAction(key("Home"), false, DEFAULTS)).toBeNull();
    expect(strataScrollKeyAction(key("End"), false, DEFAULTS)).toBeNull();
  });

  it("leaves home and end to a field, a dialog or a menu", () => {
    expect(
      strataScrollKeyAction(key("Home", { shiftKey: false }), true, DEFAULTS),
    ).toBeNull();
  });

  it("leaves plain j and k to the sections", () => {
    expect(
      strataScrollKeyAction(key("j", { shiftKey: false }), false, DEFAULTS),
    ).toBeNull();
    expect(
      strataScrollKeyAction(key("k", { shiftKey: false }), false, DEFAULTS),
    ).toBeNull();
  });

  it("ignores other keys", () => {
    expect(strataScrollKeyAction(key("L"), false, DEFAULTS)).toBeNull();
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(strataScrollKeyAction(key("J"), true, DEFAULTS)).toBeNull();
  });

  it("leaves a key that something else took", () => {
    expect(
      strataScrollKeyAction(
        key("J", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBeNull();
  });

  it("ignores them with another modifier held", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(
        strataScrollKeyAction(key("J", extra), false, DEFAULTS),
      ).toBeNull();
    }
  });
});
