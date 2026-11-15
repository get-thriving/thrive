import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { DEFAULT_KEY_BINDINGS } from "#/core/infra/strata/strata-key-defaults";
import {
  strataKeyActionOf,
  strataKeyBindingsFrom,
  strataKeyIs,
} from "#/core/infra/strata/strata-key-bindings";

const press = (
  key: string,
  extra: Partial<StrataKeyEvent> = {},
): StrataKeyEvent => ({
  key,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
  defaultPrevented: false,
  ...extra,
});

describe("DEFAULT_KEY_BINDINGS", () => {
  it("has a key for every action, and none twice", () => {
    expect(Object.keys(DEFAULT_KEY_BINDINGS).sort()).toEqual(
      Object.values(KeyboardAction).sort(),
    );
    const keys = Object.values(DEFAULT_KEY_BINDINGS);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("strataKeyBindingsFrom", () => {
  it("is the defaults when there is nothing saved", () => {
    expect(strataKeyBindingsFrom(undefined)).toEqual(DEFAULT_KEY_BINDINGS);
  });

  it("takes what the user saved", () => {
    const bindings = strataKeyBindingsFrom({ [KeyboardAction.FIND]: "/" });
    expect(bindings[KeyboardAction.FIND]).toBe("/");
    expect(bindings[KeyboardAction.HINTS]).toBe("s");
  });

  it("ignores what is not an action", () => {
    const bindings = strataKeyBindingsFrom({ nonsense: "x" });
    expect(bindings).toEqual(DEFAULT_KEY_BINDINGS);
  });
});

describe("strataKeyIs", () => {
  const bindings = strataKeyBindingsFrom({
    [KeyboardAction.FIND]: "Ctrl+/",
  });

  it("matches the key and the modifiers together", () => {
    expect(
      strataKeyIs(bindings, KeyboardAction.FIND, press("/", { ctrlKey: true })),
    ).toBe(true);
    expect(strataKeyIs(bindings, KeyboardAction.FIND, press("/"))).toBe(false);
    expect(
      strataKeyIs(
        bindings,
        KeyboardAction.FIND,
        press("/", { ctrlKey: true, altKey: true }),
      ),
    ).toBe(false);
  });

  it("no longer matches the default once it is changed", () => {
    expect(strataKeyIs(bindings, KeyboardAction.FIND, press("f"))).toBe(false);
  });
});

describe("strataKeyActionOf", () => {
  const bindings = strataKeyBindingsFrom(undefined);

  it("finds the action among the ones asked about", () => {
    expect(
      strataKeyActionOf(
        bindings,
        [KeyboardAction.NEXT, KeyboardAction.PREVIOUS],
        press("k"),
      ),
    ).toBe(KeyboardAction.PREVIOUS);
  });

  it("is null for a key of an action not asked about", () => {
    expect(
      strataKeyActionOf(bindings, [KeyboardAction.NEXT], press("k")),
    ).toBeNull();
  });

  it("is null for a modifier on its own", () => {
    expect(
      strataKeyActionOf(bindings, [KeyboardAction.NEXT], press("Shift")),
    ).toBeNull();
  });
});
