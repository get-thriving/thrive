import { describe, expect, it } from "vitest";

import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";
import { strataResizeDirection } from "#/core/infra/strata/strata-resize-key";

const bindings = strataKeyBindingsFrom(undefined);

function press(key: string, extra: Record<string, boolean> = {}) {
  return {
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    defaultPrevented: false,
    ...extra,
  };
}

describe("strataResizeDirection", () => {
  it("narrows with u and widens with i", () => {
    expect(strataResizeDirection(press("u"), false, bindings)).toBe(-1);
    expect(strataResizeDirection(press("i"), false, bindings)).toBe(1);
  });

  it("leaves other keys, and typing, alone", () => {
    expect(strataResizeDirection(press("j"), false, bindings)).toBeNull();
    expect(strataResizeDirection(press("u"), true, bindings)).toBeNull();
    expect(
      strataResizeDirection(press("i", { ctrlKey: true }), false, bindings),
    ).toBeNull();
    expect(
      strataResizeDirection(
        press("i", { defaultPrevented: true }),
        false,
        bindings,
      ),
    ).toBeNull();
  });

  it("follows the keys the user chose", () => {
    const chosen = strataKeyBindingsFrom({ "column-wider": "w" });
    expect(strataResizeDirection(press("w"), false, chosen)).toBe(1);
    expect(strataResizeDirection(press("i"), false, chosen)).toBeNull();
  });
});
