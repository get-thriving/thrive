import { KeyboardAction } from "@jupiter/webapi-client";
import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";
import { isStrataKeysHelpKey } from "#/core/infra/strata/strata-keys-help-key";

const DEFAULTS = strataKeyBindingsFrom(undefined);

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

describe("isStrataKeysHelpKey", () => {
  it("is the slash", () => {
    expect(isStrataKeysHelpKey(key("/"), false, DEFAULTS)).toBe(true);
    expect(isStrataKeysHelpKey(key("?"), false, DEFAULTS)).toBe(false);
  });

  it("leaves the key to a field, a dialog or a menu", () => {
    expect(isStrataKeysHelpKey(key("/"), true, DEFAULTS)).toBe(false);
  });

  it("leaves a key that something else took", () => {
    expect(
      isStrataKeysHelpKey(
        key("/", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBe(false);
  });

  it("ignores it with a modifier held", () => {
    for (const extra of [
      { ctrlKey: true },
      { metaKey: true },
      { altKey: true },
    ]) {
      expect(isStrataKeysHelpKey(key("/", extra), false, DEFAULTS)).toBe(false);
    }
  });

  it("leaves the slash to an action the user gave it to", () => {
    const chosen = strataKeyBindingsFrom({ [KeyboardAction.FIND]: "/" });
    expect(isStrataKeysHelpKey(key("/"), false, chosen)).toBe(false);
  });
});
