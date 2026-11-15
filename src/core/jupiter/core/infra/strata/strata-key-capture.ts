import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";
import { strataKeyBindingOfEvent } from "#/core/infra/strata/strata-key-binding";

/** What a key press means to a field that is waiting for a key to be chosen. */
export type StrataKeyCapture =
  /** `Escape` on its own: leave the choice as it was. */
  | { kind: "cancel" }
  /** A modifier held down on its own: wait for the key it goes with. */
  | { kind: "wait" }
  /** The key, or combination of keys, the user chose. */
  | { kind: "bind"; binding: string };

/**
 * What a key press means while the settings page waits for the user to press
 * the key or combination of keys they want for an action. `Escape` on its own
 * cancels, since it is how anyone leaves such a field, so it can only be
 * chosen by putting the action's default back; any other key, with whatever
 * modifiers are held, is the choice, and a modifier alone is a step towards one.
 */
export function strataKeyCapture(event: StrataKeyEvent): StrataKeyCapture {
  const binding = strataKeyBindingOfEvent(event);
  if (binding === null) {
    return { kind: "wait" };
  }
  if (binding === "Escape") {
    return { kind: "cancel" };
  }
  return { kind: "bind", binding };
}
