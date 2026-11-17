import { KeyboardAction } from "@jupiter/webapi-client";

import { DEFAULT_KEY_BINDINGS } from "#/core/infra/strata/strata-key-defaults";
import { strataKeyBindingOfEvent } from "#/core/infra/strata/strata-key-binding";
import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/** The key or combination of keys of every keyboard action, as a user has them. */
export type StrataKeyBindings = Record<KeyboardAction, string>;

/**
 * The bindings to use for what the WebAPI says a user has: theirs where it has
 * one, the default where it has none (an action added since they were saved),
 * and the defaults when it says nothing.
 */
export function strataKeyBindingsFrom(
  saved: Partial<Record<string, string>> | undefined,
): StrataKeyBindings {
  const bindings = { ...DEFAULT_KEY_BINDINGS };
  if (saved === undefined) {
    return bindings;
  }
  for (const action of Object.values(KeyboardAction)) {
    const binding = saved[action];
    if (binding !== undefined) {
      bindings[action] = binding;
    }
  }
  return bindings;
}

/** Whether a key press is the key of an action, and nothing else held. */
export function strataKeyIs(
  bindings: StrataKeyBindings,
  action: KeyboardAction,
  event: StrataKeyEvent,
): boolean {
  return strataKeyBindingOfEvent(event) === bindings[action];
}

/**
 * Which of `actions` a key press is the key of, if any, and whatever else the
 * key may be for.
 */
export function strataKeyActionOf(
  bindings: StrataKeyBindings,
  actions: readonly KeyboardAction[],
  event: StrataKeyEvent,
): KeyboardAction | null {
  const binding = strataKeyBindingOfEvent(event);
  if (binding === null) {
    return null;
  }
  return actions.find((action) => bindings[action] === binding) ?? null;
}
