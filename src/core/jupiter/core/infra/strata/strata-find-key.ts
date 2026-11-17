import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/** What a key asks of find. */
export type StrataFindKeyAction =
  /** The key of `FIND` (`f`): open the field, to type a query. */
  | "open"
  /** `Enter` in the field: go to the match, and the search is over. */
  | "commit"
  | "next"
  | "previous"
  /** `Escape`: the search is over, and things stay where they were. */
  | "cancel";

/**
 * What a key means to find, given whether its field is open. Closed, the key of
 * `FIND` (`f`) opens it. Open, `Enter` goes to the match, `↓` and `↑` step through the matches and
 * `Escape` cancels; every other key is typed, and those four are not the
 * user's to change. Never with ctrl, meta or alt held. Closed, never while the user types somewhere else or in a dialog or
 * menu, nor when something else took the key.
 */
export function strataFindKeyAction(
  event: StrataKeyEvent,
  open: boolean,
  typing: boolean,
  bindings: StrataKeyBindings,
): StrataFindKeyAction | null {
  if (!open) {
    return !typing &&
      !event.defaultPrevented &&
      strataKeyIs(bindings, KeyboardAction.FIND, event)
      ? "open"
      : null;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
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
