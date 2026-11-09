import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * Whether a key event asks to close the focused panel: Escape on its own. Never
 * while the user is typing or in a dialog or menu, which have Escape for
 * themselves, with a modifier held, or when something else took the key.
 */
export function isStrataCloseKey(
  event: StrataKeyEvent,
  typing: boolean,
): boolean {
  return (
    event.key === "Escape" &&
    !typing &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
