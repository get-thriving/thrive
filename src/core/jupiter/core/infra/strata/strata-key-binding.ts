import type { StrataKeyEvent } from "#/core/infra/strata/strata-focus-key";

/** The keys that are a modifier or nothing yet: they are never a binding. */
const NOT_A_KEY = new Set([
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "AltGraph",
  "CapsLock",
  "Fn",
  "FnLock",
  "Dead",
  "Unidentified",
  "Process",
]);

/**
 * The key binding a key press makes, written as the WebAPI keeps it (the
 * `KeyBinding` value): the modifiers held, as `Ctrl+`, `Alt+`, `Meta+` and
 * `Shift+` in that order, and then the key. A key that types a character is that
 * character, a letter in lowercase and with `Shift+` when shifted, as every
 * other character says it already (`{`, not `Shift+[`); with caps lock on, a
 * letter comes out the same as without. Any other key is named as the browser
 * does (`Enter`, `ArrowDown`); the space bar is `Space`. A modifier pressed
 * alone is not a binding: `null`.
 *
 * This is the one place a key press is turned into a binding, so a binding that
 * the user records is the one that will match it later.
 */
export function strataKeyBindingOfEvent(event: StrataKeyEvent): string | null {
  if (NOT_A_KEY.has(event.key)) {
    return null;
  }
  let key = event.key;
  let shift = event.shiftKey;
  if (key === " ") {
    key = "Space";
  } else if (key.length === 1) {
    if (key.toLowerCase() !== key.toUpperCase()) {
      key = key.toLowerCase();
    } else {
      shift = false;
    }
  }
  return [
    event.ctrlKey ? "Ctrl+" : "",
    event.altKey ? "Alt+" : "",
    event.metaKey ? "Meta+" : "",
    shift ? "Shift+" : "",
    key,
  ].join("");
}

const KEY_NAMES: Record<string, string> = {
  Enter: "↵",
  Escape: "esc",
  Backspace: "⌫",
  Delete: "⌦",
  Tab: "⇥",
  Space: "space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

const MODIFIER_NAMES: Record<string, string> = {
  Ctrl: "⌃",
  Alt: "⌥",
  Meta: "⌘",
  Shift: "⇧",
};

/**
 * How a binding is drawn, as one chip: `⇧k` for `Shift+k`, `↵` for `Enter`,
 * `esc` for `Escape`, with the modifiers as their symbols. Anything that is not
 * a binding is drawn as it is.
 */
export function strataKeyBindingLabel(binding: string): string {
  let rest = binding;
  let label = "";
  for (const modifier of Object.keys(MODIFIER_NAMES)) {
    if (rest.startsWith(`${modifier}+`) && rest.length > modifier.length + 1) {
      label += MODIFIER_NAMES[modifier];
      rest = rest.slice(modifier.length + 1);
    }
  }
  return label + (KEY_NAMES[rest] ?? rest);
}
