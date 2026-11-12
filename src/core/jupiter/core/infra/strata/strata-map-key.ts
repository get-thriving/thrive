import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * Whether a key event asks for the map of the columns: `a` on its own, to go
 * to any column or section at once, where `j` and `k` go to the next one. Never
 * while the user is typing or in a dialog or menu, with a modifier held, or
 * when something else took the key.
 */
export function isStrataMapEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
): boolean {
  return (
    event.key === "a" &&
    !typing &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
