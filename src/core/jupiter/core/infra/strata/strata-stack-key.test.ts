import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataNextSection,
  strataStackKeyAction,
} from "#/core/infra/strata/strata-stack-key";

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

describe("strataStackKeyAction", () => {
  it("moves on j and k, opens on enter, goes into the items on e", () => {
    expect(strataStackKeyAction(key("j"), false)).toBe("next");
    expect(strataStackKeyAction(key("k"), false)).toBe("previous");
    expect(strataStackKeyAction(key("Enter"), false)).toBe("open");
    expect(strataStackKeyAction(key("e"), false)).toBe("items");
  });

  it("ignores other keys", () => {
    expect(strataStackKeyAction(key("x"), false)).toBeNull();
  });

  it("leaves the keys to a field, a dialog or a menu", () => {
    for (const name of ["j", "k", "Enter", "e"]) {
      expect(strataStackKeyAction(key(name), true)).toBeNull();
    }
  });

  it("leaves a key that something else took", () => {
    expect(
      strataStackKeyAction(key("j", { defaultPrevented: true }), false),
    ).toBeNull();
  });

  it("ignores a key with a modifier", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
      { shiftKey: true },
    ]) {
      expect(strataStackKeyAction(key("j", extra), false)).toBeNull();
    }
  });
});

describe("strataNextSection", () => {
  it("works for the items of a section as it does for sections", () => {
    expect(strataNextSection("next", 4, 1)).toBe(2);
    expect(strataNextSection("next", 4, 3)).toBe(3);
  });

  it("starts at the first section going down and the last going up", () => {
    expect(strataNextSection("next", 3, -1)).toBe(0);
    expect(strataNextSection("previous", 3, -1)).toBe(2);
  });

  it("moves one section", () => {
    expect(strataNextSection("next", 3, 0)).toBe(1);
    expect(strataNextSection("previous", 3, 2)).toBe(1);
  });

  it("stops at the ends", () => {
    expect(strataNextSection("next", 3, 2)).toBe(2);
    expect(strataNextSection("previous", 3, 0)).toBe(0);
  });

  it("has nowhere to go without sections", () => {
    expect(strataNextSection("next", 0, -1)).toBeNull();
  });
});
