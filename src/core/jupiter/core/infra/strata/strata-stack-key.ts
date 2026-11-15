import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyActionOf,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

export type StrataStackKeyAction = "next" | "previous" | "open" | "items";

const STACK_ACTIONS: Record<string, StrataStackKeyAction> = {
  [KeyboardAction.NEXT]: "next",
  [KeyboardAction.PREVIOUS]: "previous",
  [KeyboardAction.OPEN]: "open",
  [KeyboardAction.EDIT]: "items",
};

/**
 * What a key event asks of a stack of sections: the key of `NEXT` (`j`) moves
 * to the next section, that of `PREVIOUS` (`k`) to the previous one, that of
 * `OPEN` (`↵`) goes inside the section that has the focus, and that of `EDIT`
 * (`e`) goes into its list, to the first item. With the focus on an item, the
 * first two move between the items and `OPEN` opens the one that has it. Never
 * while the user is typing or in a dialog or menu, or when something else took
 * the key.
 */
export function strataStackKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): StrataStackKeyAction | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  const action = strataKeyActionOf(
    bindings,
    [
      KeyboardAction.NEXT,
      KeyboardAction.PREVIOUS,
      KeyboardAction.OPEN,
      KeyboardAction.EDIT,
    ],
    event,
  );
  return action === null ? null : STACK_ACTIONS[action];
}

/**
 * The index of the section a `j` or `k` moves to, given the one the focus is in
 * (`-1` for none). It stops at the ends rather than wrapping. `null` when there
 * is no section to move to. The same goes for the items of a section.
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
