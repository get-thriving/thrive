import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * What a key event asks of a section: the key of `SPLIT` (`c`) splits it out
 * into a column of its own, that of `FOLD_BACK` (`⇧c`) folds the focused split
 * column back. Never while the user is typing or in a dialog or menu, or when
 * something else took the key.
 */
export function strataSplitKeyAction(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): "split" | "fold" | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  if (strataKeyIs(bindings, KeyboardAction.SPLIT, event)) {
    return "split";
  }
  if (strataKeyIs(bindings, KeyboardAction.FOLD_BACK, event)) {
    return "fold";
  }
  return null;
}
