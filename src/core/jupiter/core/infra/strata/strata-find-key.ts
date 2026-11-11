import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/** What a key asks of find. */
export type StrataFindKeyAction =
  /** `/`: open the field, to type a query. */
  | "open"
  /** `Enter` in the field: go to the match, and the search is over. */
  | "commit"
  | "next"
  | "previous"
  /** `Escape`: the search is over, and things stay where they were. */
  | "cancel";

/**
 * What a key means to find, given whether its field is open. Closed, `/` opens
 * it. Open, `Enter` goes to the match, `↓` and `↑` step through the matches and
 * `Escape` cancels; every other key is typed. Never with ctrl, meta or alt
 * held. Closed, never while the user types somewhere else or in a dialog or
 * menu, nor when something else took the key.
 */
export function strataFindKeyAction(
  event: StrataKeyEvent,
  open: boolean,
  typing: boolean,
): StrataFindKeyAction | null {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }
  if (!open) {
    return !typing && !event.defaultPrevented && event.key === "/"
      ? "open"
      : null;
  }
  switch (event.key) {
    case "Enter":
      return "commit";
    case "ArrowDown":
      return "next";
    case "ArrowUp":
      return "previous";
    case "Escape":
      return "cancel";
    default:
      return null;
  }
}
