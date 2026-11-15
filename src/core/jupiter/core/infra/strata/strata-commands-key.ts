import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks for the menu of commands: the key of `COMMANDS`
 * (`x`). Never while the user is typing or in a dialog or menu, or when
 * something else took the key. Once it is open it takes keys as the menu of
 * apps does (`strataAppMenuKeyAction`).
 */
export function isStrataCommandsEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.COMMANDS, event)
  );
}
