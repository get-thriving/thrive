import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/** What a key does while a filter of many choices is open for searching. */
export type StrataCommandSearchKeyAction =
  /** Leave the menu; `Escape`. */
  | { kind: "exit" }
  /** Leave the menu and let the key go on: a shortcut of the browser or app. */
  | { kind: "leave" }
  /** Take back the last character, or close the panel when there is none. */
  | { kind: "back" }
  /** Move to the choice before or after. */
  | { kind: "move"; by: -1 | 1 }
  /** Turn the choice under the cursor on or off; `Enter`. */
  | { kind: "toggle" }
  /** A character of the search. */
  | { kind: "type"; text: string }
  /** Nothing, but the key stays out of the page behind the menu. */
  | { kind: "ignore" };

/**
 * What a key means in the panel of a filter of many choices, where the keys
 * write a search instead of choosing by letter: a character is added to it,
 * `Backspace` takes one back, the arrows move along the choices that are found
 * and `Enter` turns the one under the cursor on or off. As elsewhere in the
 * menu, a key with a modifier, or a function key, is a shortcut of the browser
 * or the app: it leaves the menu and goes on.
 */
export function strataCommandSearchKeyAction(
  event: StrataKeyEvent,
): StrataCommandSearchKeyAction {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return { kind: "leave" };
  }
  if (/^F\d{1,2}$/.test(event.key)) {
    return { kind: "leave" };
  }
  switch (event.key) {
    case "Escape":
      return { kind: "exit" };
    case "Backspace":
      return { kind: "back" };
    case "ArrowDown":
      return { kind: "move", by: 1 };
    case "ArrowUp":
      return { kind: "move", by: -1 };
    case "Enter":
      return { kind: "toggle" };
  }
  // One character, as `key` names a key that types: `Tab` and `Shift` are not.
  if ([...event.key].length === 1) {
    return { kind: "type", text: event.key };
  }
  return { kind: "ignore" };
}
