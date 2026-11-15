import type { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataKeyBindings } from "#/core/infra/strata/strata-key-bindings";

/**
 * The other action that already has `binding`, if one does: giving it to
 * `action` as well would leave one key for two things, which the WebAPI refuses.
 * `null` when `binding` is free, or is the key `action` has already.
 */
export function strataKeyConflict(
  bindings: StrataKeyBindings,
  action: KeyboardAction,
  binding: string,
): KeyboardAction | null {
  for (const other of Object.keys(bindings) as KeyboardAction[]) {
    if (other !== action && bindings[other] === binding) {
      return other;
    }
  }
  return null;
}
