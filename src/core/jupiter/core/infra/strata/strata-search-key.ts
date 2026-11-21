import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyActionOf,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";
import { strataKeyBindingOfEvent } from "#/core/infra/strata/strata-key-binding";

/** What a key does in the search dialog (ADR 0006, ADR 0021). */
export type StrataSearchKey =
  /** Out of the query and into the results. */
  | "into"
  /** To the next result. */
  | "next"
  /** To the previous result, or up to the query from the first. */
  | "previous"
  /** Open the result that has the focus. */
  | "open"
  /** Back to the query, from anywhere among the results. */
  | "query";

const RESULT_ACTIONS = [
  KeyboardAction.NEXT,
  KeyboardAction.PREVIOUS,
  KeyboardAction.OPEN,
  KeyboardAction.FIND,
] as const;

/**
 * What a key press does in the search dialog, if anything. In the query field
 * the user is typing, so only `Enter` and `↓`, which type nothing, go on into the
 * results. Among the results the keys are the ones the user chose for the
 * actions of the same name elsewhere: `NEXT` and `PREVIOUS` move along the
 * results, `OPEN` opens the one with the focus, and `FIND` goes back to the
 * query, as it goes to the find field of a page; `↓` and `↑` always move, as in
 * every list.
 */
export function strataSearchKey(
  event: StrataKeyEvent,
  inQuery: boolean,
  bindings: StrataKeyBindings,
): StrataSearchKey | null {
  if (event.defaultPrevented) {
    return null;
  }
  const binding = strataKeyBindingOfEvent(event);
  if (inQuery) {
    return binding === "Enter" || binding === "ArrowDown" ? "into" : null;
  }
  if (binding === "ArrowDown") {
    return "next";
  }
  if (binding === "ArrowUp") {
    return "previous";
  }
  switch (strataKeyActionOf(bindings, RESULT_ACTIONS, event)) {
    case KeyboardAction.NEXT:
      return "next";
    case KeyboardAction.PREVIOUS:
      return "previous";
    case KeyboardAction.OPEN:
      return "open";
    case KeyboardAction.FIND:
      return "query";
    default:
      return null;
  }
}
