import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import { isStrataNewMenuEnterKey } from "#/core/infra/strata/strata-new-menu-key";
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

describe("isStrataNewMenuEnterKey", () => {
  it("opens on n", () => {
    expect(isStrataNewMenuEnterKey(press("n"), false, DEFAULTS)).toBe(true);
  });

  it("opens on the key the user chose, and no longer on n", () => {
    const chosen = strataKeyBindingsFrom({ [KeyboardAction.NEW]: "g" });
    expect(isStrataNewMenuEnterKey(press("g"), false, chosen)).toBe(true);
    expect(isStrataNewMenuEnterKey(press("n"), false, chosen)).toBe(false);
  });

  it("stays out of fields and of what something else took", () => {
    expect(isStrataNewMenuEnterKey(press("n"), true, DEFAULTS)).toBe(false);
    expect(
      isStrataNewMenuEnterKey(
        press("n", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores n with a modifier", () => {
    expect(
      isStrataNewMenuEnterKey(press("n", { ctrlKey: true }), false, DEFAULTS),
    ).toBe(false);
    expect(
      isStrataNewMenuEnterKey(press("n", { metaKey: true }), false, DEFAULTS),
    ).toBe(false);
  });
});
