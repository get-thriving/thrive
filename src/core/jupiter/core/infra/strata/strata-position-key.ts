import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Which way a key moves an open item along its collection: the key of
 * `POSITION_PREVIOUS` (`o`) goes to the previous item and that of
 * `POSITION_NEXT` (`p`) to the next. Never while the user is typing or in a
 * dialog or menu, or when something else took the key.
 */
export function strataPositionKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): "previous" | "next" | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  if (strataKeyIs(bindings, KeyboardAction.POSITION_PREVIOUS, event)) {
    return "previous";
  }
  if (strataKeyIs(bindings, KeyboardAction.POSITION_NEXT, event)) {
    return "next";
  }
  return null;
}
