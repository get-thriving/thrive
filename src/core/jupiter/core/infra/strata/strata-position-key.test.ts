import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyBindingsFrom,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";
import { strataPositionKeyAction } from "#/core/infra/strata/strata-position-key";

const DEFAULTS = strataKeyBindingsFrom(undefined);

function press(
  key: string,
  extra: Partial<StrataKeyEvent> = {},
): StrataKeyEvent {
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

describe("strataPositionKeyAction", () => {
  it("goes to the previous item on o and the next on p", () => {
    expect(strataPositionKeyAction(press("o"), false, DEFAULTS)).toBe(
      "previous",
    );
    expect(strataPositionKeyAction(press("p"), false, DEFAULTS)).toBe("next");
  });

  it("goes by what the key types", () => {
    expect(strataPositionKeyAction(press("{"), false, DEFAULTS)).toBeNull();
    expect(strataPositionKeyAction(press("ü"), false, DEFAULTS)).toBeNull();
  });

  it("goes by the keys the user chose", () => {
    const chosen: StrataKeyBindings = {
      ...DEFAULTS,
      [KeyboardAction.POSITION_PREVIOUS]: "Ctrl+ArrowLeft",
      [KeyboardAction.POSITION_NEXT]: "Ctrl+ArrowRight",
    };
    expect(
      strataPositionKeyAction(
        press("ArrowLeft", { ctrlKey: true }),
        false,
        chosen,
      ),
    ).toBe("previous");
    expect(
      strataPositionKeyAction(
        press("ArrowRight", { ctrlKey: true }),
        false,
        chosen,
      ),
    ).toBe("next");
    expect(strataPositionKeyAction(press("o"), false, chosen)).toBeNull();
  });

  it("is not ours while typing, or with a modifier, or once taken", () => {
    expect(strataPositionKeyAction(press("o"), true, DEFAULTS)).toBeNull();
    for (const modifier of ["ctrlKey", "metaKey", "altKey"] as const) {
      expect(
        strataPositionKeyAction(
          press("p", { [modifier]: true }),
          false,
          DEFAULTS,
        ),
      ).toBeNull();
    }
    expect(
      strataPositionKeyAction(
        press("p", { defaultPrevented: true }),
        false,
        DEFAULTS,
      ),
    ).toBeNull();
  });
});
