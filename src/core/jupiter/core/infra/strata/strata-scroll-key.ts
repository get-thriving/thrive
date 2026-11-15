import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

export type StrataScrollKeyAction = "top" | "bottom";

/**
 * What a key event asks of the focused column's scrolling: the key of
 * `SCROLL_TOP` (`⇧k`), or `Home`, goes to the top of it and that of
 * `SCROLL_BOTTOM` (`⇧j`), or `End`, to the bottom. `Home` and `End` are
 * always those, whatever the user chose. Never while the user is typing or in a
 * dialog or menu, or when something else took the key.
 */
export function strataScrollKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): StrataScrollKeyAction | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  if (
    strataKeyIs(bindings, KeyboardAction.SCROLL_TOP, event) ||
    (event.key === "Home" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey)
  ) {
    return "top";
  }
  if (
    strataKeyIs(bindings, KeyboardAction.SCROLL_BOTTOM, event) ||
    (event.key === "End" &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey)
  ) {
    return "bottom";
  }
  return null;
}
