import { describe, expect, it } from "vitest";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyBindingLabel,
  strataKeyBindingOfEvent,
} from "#/core/infra/strata/strata-key-binding";

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

describe("strataKeyBindingOfEvent", () => {
  it("is the character a key types", () => {
    expect(strataKeyBindingOfEvent(press("j"))).toBe("j");
    expect(strataKeyBindingOfEvent(press("."))).toBe(".");
    expect(strataKeyBindingOfEvent(press("["))).toBe("[");
  });

  it("names the other keys", () => {
    expect(strataKeyBindingOfEvent(press("Enter"))).toBe("Enter");
    expect(strataKeyBindingOfEvent(press("ArrowDown"))).toBe("ArrowDown");
    expect(strataKeyBindingOfEvent(press(" "))).toBe("Space");
  });

  it("puts Shift on a shifted letter, in lowercase", () => {
    expect(strataKeyBindingOfEvent(press("K", { shiftKey: true }))).toBe(
      "Shift+k",
    );
  });

  it("does not put Shift on a character that says it already", () => {
    expect(strataKeyBindingOfEvent(press("{", { shiftKey: true }))).toBe("{");
    expect(strataKeyBindingOfEvent(press("!", { shiftKey: true }))).toBe("!");
  });

  it("keeps Shift on a named key", () => {
    expect(strataKeyBindingOfEvent(press("Tab", { shiftKey: true }))).toBe(
      "Shift+Tab",
    );
  });

  it("writes the modifiers in one order", () => {
    expect(
      strataKeyBindingOfEvent(
        press("k", {
          shiftKey: true,
          metaKey: true,
          altKey: true,
          ctrlKey: true,
        }),
      ),
    ).toBe("Ctrl+Alt+Meta+Shift+k");
  });

  it("reads a letter the same with caps lock on", () => {
    expect(strataKeyBindingOfEvent(press("K"))).toBe("k");
    expect(strataKeyBindingOfEvent(press("k", { shiftKey: true }))).toBe(
      "Shift+k",
    );
  });

  it("is nothing for a modifier on its own", () => {
    for (const key of ["Shift", "Control", "Alt", "Meta", "Dead"]) {
      expect(strataKeyBindingOfEvent(press(key))).toBeNull();
    }
  });
});

describe("strataKeyBindingLabel", () => {
  it("draws the keys as the footer does", () => {
    expect(strataKeyBindingLabel("h")).toBe("h");
    expect(strataKeyBindingLabel("Shift+c")).toBe("⇧c");
    expect(strataKeyBindingLabel("Enter")).toBe("↵");
    expect(strataKeyBindingLabel("Escape")).toBe("esc");
    expect(strataKeyBindingLabel("Space")).toBe("space");
  });

  it("draws the modifiers as their symbols", () => {
    expect(strataKeyBindingLabel("Ctrl+Alt+Meta+Shift+ArrowUp")).toBe("⌃⌥⌘⇧↑");
  });

  it("draws a plus as it is", () => {
    expect(strataKeyBindingLabel("+")).toBe("+");
    expect(strataKeyBindingLabel("Ctrl++")).toBe("⌃+");
  });
});
