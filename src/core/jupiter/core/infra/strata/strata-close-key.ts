import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks to close the focused panel: the key of `CLOSE`
 * (`Escape`). Never while the user is typing or in a dialog or menu, which have
 * Escape for themselves, or when something else took the key.
 */
export function isStrataCloseKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.CLOSE, event)
  );
}
