import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * What a key event asks of a section: `c` splits it out into a column of its
 * own, `⇧c` folds the focused split column back. Never while the user is typing
 * or in a dialog or menu, with another modifier held, or when something else
 * took the key.
 */
export function strataSplitKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
): "split" | "fold" | null {
  if (
    typing ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  ) {
    return null;
  }
  if (event.key.toLowerCase() !== "c") {
    return null;
  }
  return event.shiftKey ? "fold" : "split";
}
