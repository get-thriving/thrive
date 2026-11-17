import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * Whether a key event asks for the menu of new items: the key of `NEW` (`n`).
 * Never while the user is typing or in a dialog or menu, or when something
 * else took the key. Inside the menu the keys are those of the menu of apps
 * (`strataAppMenuKeyAction`).
 */
export function isStrataNewMenuEnterKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  return (
    !typing &&
    !event.defaultPrevented &&
    strataKeyIs(bindings, KeyboardAction.NEW, event)
  );
}
