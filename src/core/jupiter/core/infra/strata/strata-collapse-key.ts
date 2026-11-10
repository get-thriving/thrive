import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * Whether a key event asks to collapse or expand a section: `z` on its own. Never
 * while the user is typing or in a dialog or menu, with a modifier held, or when
 * something else took the key.
 */
export function isStrataCollapseKey(
  event: StrataKeyEvent,
  typing: boolean,
): boolean {
  return (
    event.key === "z" &&
    !typing &&
    !event.defaultPrevented &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
