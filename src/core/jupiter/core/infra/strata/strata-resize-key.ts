import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import {
  strataKeyIs,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";
import type { StrataResizeDirection } from "#/core/infra/strata/strata-column-resize";

/**
 * Which way a key resizes the focused column: the key of `COLUMN_NARROWER`
 * (`u`) narrows it (-1), that of `COLUMN_WIDER` (`i`) widens it (1), anything
 * else is not ours (null). Never while the user is typing, or when something
 * else took the key.
 */
export function strataResizeDirection(
  event: StrataKeyEvent,
  typing: boolean,
  bindings: StrataKeyBindings,
): StrataResizeDirection | null {
  if (typing || event.defaultPrevented) {
    return null;
  }
  if (strataKeyIs(bindings, KeyboardAction.COLUMN_NARROWER, event)) {
    return -1;
  }
  if (strataKeyIs(bindings, KeyboardAction.COLUMN_WIDER, event)) {
    return 1;
  }
  return null;
}
