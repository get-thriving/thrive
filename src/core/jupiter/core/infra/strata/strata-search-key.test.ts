import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";
import { strataSearchKey } from "#/core/infra/strata/strata-search-key";

const DEFAULTS = strataKeyBindingsFrom(undefined);

function press(key: string, extra: Partial<KeyboardEvent> = {}) {
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

describe("strataSearchKey", () => {
  it("only goes into the results from the query, and types the rest", () => {
    expect(strataSearchKey(press("Enter"), true, DEFAULTS)).toBe("into");
    expect(strataSearchKey(press("ArrowDown"), true, DEFAULTS)).toBe("into");
    expect(strataSearchKey(press("j"), true, DEFAULTS)).toBeNull();
    expect(strataSearchKey(press("f"), true, DEFAULTS)).toBeNull();
  });

  it("uses the keys of the actions among the results", () => {
    expect(strataSearchKey(press("j"), false, DEFAULTS)).toBe("next");
    expect(strataSearchKey(press("k"), false, DEFAULTS)).toBe("previous");
    expect(strataSearchKey(press("Enter"), false, DEFAULTS)).toBe("open");
    expect(strataSearchKey(press("f"), false, DEFAULTS)).toBe("query");
  });

  it("always moves with the arrows", () => {
    expect(strataSearchKey(press("ArrowDown"), false, DEFAULTS)).toBe("next");
    expect(strataSearchKey(press("ArrowUp"), false, DEFAULTS)).toBe("previous");
  });

  it("follows the keys the user chose", () => {
    const chosen = strataKeyBindingsFrom({
      [KeyboardAction.NEXT]: "n",
      [KeyboardAction.PREVIOUS]: "Shift+p",
      [KeyboardAction.FIND]: "/",
    });
    expect(strataSearchKey(press("n"), false, chosen)).toBe("next");
    expect(strataSearchKey(press("P", { shiftKey: true }), false, chosen)).toBe(
      "previous",
    );
    expect(strataSearchKey(press("/"), false, chosen)).toBe("query");
    expect(strataSearchKey(press("j"), false, chosen)).toBeNull();
  });

  it("leaves a key with a modifier that is not a binding, and a taken key", () => {
    expect(
      strataSearchKey(press("j", { ctrlKey: true }), false, DEFAULTS),
    ).toBeNull();
    expect(
      strataSearchKey(press("j", { defaultPrevented: true }), false, DEFAULTS),
    ).toBeNull();
  });
});
