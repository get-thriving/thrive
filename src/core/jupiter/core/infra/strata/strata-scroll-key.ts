import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

export type StrataScrollKeyAction = "top" | "bottom";

/**
 * What a key event asks of the focused column's scrolling: `⇧k` goes to the top
 * of it and `⇧j` to the bottom, the capital versions of the keys that move up
 * and down through its sections. Never while the user is typing or in a dialog
 * or menu, with another modifier held, or when something else took the key.
 */
export function strataScrollKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
): StrataScrollKeyAction | null {
  if (
    typing ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    !event.shiftKey
  ) {
    return null;
  }
  // With caps lock on, the shifted letter comes as the small one.
  switch (event.key.toLowerCase()) {
    case "k":
      return "top";
    case "j":
      return "bottom";
    default:
      return null;
  }
}
