import { describe, expect, it } from "vitest";
import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataKeyBindingsFrom } from "#/core/infra/strata/strata-key-bindings";
import { strataKeyCapture } from "#/core/infra/strata/strata-key-capture";
import { strataKeyConflict } from "#/core/infra/strata/strata-key-conflict";

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

describe("strataKeyCapture", () => {
  it("chooses the key that was pressed", () => {
    expect(strataKeyCapture(press("q"))).toEqual({
      kind: "bind",
      binding: "q",
    });
  });

  it("chooses a combination", () => {
    expect(
      strataKeyCapture(press("K", { shiftKey: true, ctrlKey: true })),
    ).toEqual({ kind: "bind", binding: "Ctrl+Shift+k" });
  });

  it("waits while only a modifier is held", () => {
    expect(strataKeyCapture(press("Shift", { shiftKey: true }))).toEqual({
      kind: "wait",
    });
  });

  it("cancels on Escape on its own", () => {
    expect(strataKeyCapture(press("Escape"))).toEqual({ kind: "cancel" });
  });

  it("chooses Escape with a modifier", () => {
    expect(strataKeyCapture(press("Escape", { shiftKey: true }))).toEqual({
      kind: "bind",
      binding: "Shift+Escape",
    });
  });
});

describe("strataKeyConflict", () => {
  const bindings = strataKeyBindingsFrom(undefined);

  it("names the action that has the key", () => {
    expect(strataKeyConflict(bindings, KeyboardAction.FIND, "s")).toBe(
      KeyboardAction.HINTS,
    );
  });

  it("is null for a free key", () => {
    expect(strataKeyConflict(bindings, KeyboardAction.FIND, "/")).toBeNull();
  });

  it("is null for the key the action has already", () => {
    expect(strataKeyConflict(bindings, KeyboardAction.FIND, "f")).toBeNull();
  });
});
