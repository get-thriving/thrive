import { STRATA_HINT_ALPHABET } from "#/core/infra/strata/strata-hint-labels";
import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * Whether a key event asks for hint mode: `s` on its own. Never while the user
 * is typing or in a dialog or menu, with a modifier held, or when something
 * else took the key.
 */
export function isStrataHintEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
): boolean {
  return (
    event.key === "s" &&
    !typing &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}

/** What a key does while hint mode is on. */
export type StrataHintKeyAction =
  /** Leave the mode; `Escape`. */
  | { kind: "exit" }
  /** Leave the mode and let the key go on: a shortcut of the browser or app. */
  | { kind: "leave" }
  /** Take back the last letter. */
  | { kind: "back" }
  /** A letter of a label. */
  | { kind: "letter"; letter: string }
  /** Nothing, but the key stays out of the page behind the labels. */
  | { kind: "ignore" };

/**
 * What a key means in hint mode, where the labels take every key: the letters
 * of the alphabet choose, `Backspace` takes one back and `Escape` leaves. A key
 * with a modifier, or a function key, is a shortcut of the browser or the app
 * (reload, search): it leaves the mode, because the labels would be stale, and
 * goes on. Anything else is held back.
 */
export function strataHintKeyAction(
  event: StrataKeyEvent,
): StrataHintKeyAction {
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
  const letter = event.key.toLowerCase();
  if (event.key.length === 1 && STRATA_HINT_ALPHABET.includes(letter)) {
    return { kind: "letter", letter };
  }
  return { kind: "ignore" };
}
