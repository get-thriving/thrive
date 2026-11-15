import { KeyboardAction } from "@jupiter/webapi-client";

import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/** The parts of a key event the focus keys look at. */
export interface StrataKeyEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  defaultPrevented: boolean;
}

/**
 * Which way a key moves the focus along the open panels: the key of
 * `COLUMN_PREVIOUS` (`h`) goes left (-1), that of `COLUMN_NEXT` (`l`) goes
 * right (1), anything else is not ours (null). Never while the user is typing,
 * or when something else took the key.
 */
export function strataFocusStep(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): -1 | 1 | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  if (strataKeyIs(bindings, KeyboardAction.COLUMN_PREVIOUS, event)) {
    return -1;
  }
  if (strataKeyIs(bindings, KeyboardAction.COLUMN_NEXT, event)) {
    return 1;
  }
  return null;
}
