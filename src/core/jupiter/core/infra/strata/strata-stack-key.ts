import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/**
 * What a key event asks of a stack of sections: `j` moves to the next section,
 * `k` to the previous one, `↵` opens the first item of the section that has the
 * focus. Never while the user is typing or in a dialog or menu, with a modifier
 * held, or when something else took the key.
 */
export function strataStackKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
): "next" | "previous" | "open" | null {
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
    case "j":
      return "next";
    case "k":
      return "previous";
    case "Enter":
      return "open";
    default:
      return null;
  }
}

/**
 * The index of the section a `j` or `k` moves to, given the one the focus is in
 * (`-1` for none). It stops at the ends rather than wrapping. `null` when there
 * is no section to move to.
 */
export function strataNextSection(
  action: "next" | "previous",
  count: number,
  current: number,
): number | null {
  if (count === 0) {
    return null;
  }
  if (current < 0) {
    return action === "next" ? 0 : count - 1;
  }
  return Math.min(
    count - 1,
    Math.max(0, current + (action === "next" ? 1 : -1)),
  );
}
