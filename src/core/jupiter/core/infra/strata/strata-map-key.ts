import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks for the map of the columns: the key of `MAP` (`a`),
 * to go to any column or section at once, where the key of `NEXT` goes to the
 * next one. Never while the user is typing or in a dialog or menu, or when
 * something else took the key.
 */
export function isStrataMapEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.MAP, event)
  );
}
