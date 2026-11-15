import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks for the menu of apps and pages: the key of `APPS`
 * (`q`). Never while the user is typing or in a dialog or menu, or when
 * something else took the key.
 */
export function isStrataAppMenuEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.APPS, event)
  );
}

/** What a key does while the menu of apps and pages is open. */
export type StrataAppMenuKeyAction =
  /** Leave the menu; `Escape`. */
  | { kind: "exit" }
  /** Leave the menu and let the key go on: a shortcut of the browser or app. */
  | { kind: "leave" }
  /** Take back the last letter. */
  | { kind: "back" }
  /** A letter of a label. */
  | { kind: "letter"; letter: string }
  /** Nothing, but the key stays out of the page behind the menu. */
  | { kind: "ignore" };

/**
 * What a key means in the menu of apps and pages, where the labels take every
 * key: a letter chooses, `Backspace` takes one back and `Escape` leaves. A key
 * with a modifier, or a function key, is a shortcut of the browser or the app
 * (reload, search): it leaves the menu and goes on. Anything else is held back.
 * Its labels are made of every letter, unlike the hints', which keep to the
 * home row.
 */
export function strataAppMenuKeyAction(
  event: StrataKeyEvent,
): StrataAppMenuKeyAction {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return { kind: "leave" };
  }
  if (/^F\d{1,2}$/.test(event.key)) {
    return { kind: "leave" };
  }
  if (event.key === "Escape") {
    return { kind: "exit" };
  }
  if (event.key === "Backspace") {
    return { kind: "back" };
  }
  if (/^[a-zA-Z]$/.test(event.key)) {
    return { kind: "letter", letter: event.key.toLowerCase() };
  }
  return { kind: "ignore" };
}
