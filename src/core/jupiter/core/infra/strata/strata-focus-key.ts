/** The parts of a key event the focus keys look at. */
export interface StrataKeyEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  defaultPrevented: boolean;
}

/**
 * Which way a key moves the focus along the open panels: `h` goes left (-1),
 * `l` goes right (1), anything else is not ours (null). Never while the user is
 * typing, with a modifier held, or when something else took the key.
 */
export function strataFocusStep(
  event: StrataKeyEvent,
  typing: boolean,
): -1 | 1 | null {
  if (
    typing ||
    event.defaultPrevented ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return null;
  }
  switch (event.key) {
    case "h":
      return -1;
    case "l":
      return 1;
    default:
      return null;
  }
}
