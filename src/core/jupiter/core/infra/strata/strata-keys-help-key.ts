import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import type { StrataKeyBindings } from "#/core/infra/strata/strata-key-bindings";

/** The key that lists the keys that work now; not one the user chooses. */
export const STRATA_KEYS_HELP_KEY = "/";

/**
 * Whether a key event asks for the list of the keys that work now: `/`, with
 * nothing else held. Never while the user is typing or in a dialog or menu, or
 * when something else took the key; and not when the user has given `/` to an
 * action of their own, such as find, which keeps it.
 */
export function isStrataKeysHelpKey(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): boolean {
  if (typing || event.defaultPrevented) {
    return false;
  }
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }
  if (event.key !== STRATA_KEYS_HELP_KEY) {
    return false;
  }
  return !(Object.values(KeyboardAction) as KeyboardAction[]).some(
    (action) => bindings[action] === STRATA_KEYS_HELP_KEY,
  );
}
