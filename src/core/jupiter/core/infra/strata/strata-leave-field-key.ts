import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * Whether a key event asks to leave the field the user is typing in, back to
 * the keys that move around: Escape on its own, from a field. Not from a
 * dialog or a menu, which keep Escape for themselves, with a modifier held, or
 * when something else took the key, such as an open list of suggestions.
 */
export function isStrataLeaveFieldKey(
  event: StrataKeyEvent,
  inField: boolean,
): boolean {
  return (
    event.key === "Escape" &&
    inField &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
