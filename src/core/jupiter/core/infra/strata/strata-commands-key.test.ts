import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import { isStrataCommandsEnterKey } from "#/core/infra/strata/strata-commands-key";
import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";

const DEFAULTS = strataKeyBindingsFrom(undefined);

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

describe("isStrataCommandsEnterKey", () => {
  it("opens on x", () => {
    expect(isStrataCommandsEnterKey(press("x"), false, DEFAULTS)).toBe(true);
  });

  it("opens on the key the user chose, and no longer on x", () => {
    const chosen = strataKeyBindingsFrom({ [KeyboardAction.COMMANDS]: "g" });
    expect(isStrataCommandsEnterKey(press("g"), false, chosen)).toBe(true);
    expect(isStrataCommandsEnterKey(press("x"), false, chosen)).toBe(false);
  });

  it("stays out of fields and of what something else took", () => {
    expect(isStrataCommandsEnterKey(press("x"), true, DEFAULTS)).toBe(false);
    expect(
      isStrataCommandsEnterKey(
        press("x", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores x with a modifier", () => {
    expect(
      isStrataCommandsEnterKey(press("x", { ctrlKey: true }), false, DEFAULTS),
    ).toBe(false);
    expect(
      isStrataCommandsEnterKey(press("x", { metaKey: true }), false, DEFAULTS),
    ).toBe(false);
  });
});
