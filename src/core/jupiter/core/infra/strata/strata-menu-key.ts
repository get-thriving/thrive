import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks to open the menu of the focused column: the key of
 * `MENU` (`.`). Never while the user is typing or in a dialog or menu (which is
 * what lets the same key do nothing once the menu is open), or when something
 * else took the key.
 */
export function isStrataMenuKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.MENU, event)
  );
}
