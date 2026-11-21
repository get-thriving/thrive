import { KeyboardAction } from "@jupiter/webapi-client";

import type { StrataFooterKey } from "#/core/infra/strata/strata-footer-key";
import { strataKeyBindingLabel } from "#/core/infra/strata/strata-key-binding";
import type { StrataKeyBindings } from "#/core/infra/strata/strata-key-bindings";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";

/** Escape, in the modes and fields, where it is not the user's to change. */
const ESCAPE = ["esc"];

/**
 * The keys that work right now, for the footer (ADR 0021), in the order they
 * are drawn: first the ones that move, then the ones that act on what has the
 * focus, then the ones that work wherever the focus is. The footer clips from
 * the end when it is too narrow, so what is easiest to do without comes last.
 *
 * While something has taken the keys, such as hint mode, the footer says how to
 * use it and how to leave it; in a field, only how to leave the field. Each key
 * is listed only where it does something, as the rules of the keys decide:
 * `h` and `l` with a column to go to, `e` with a list to go into, `z` and `c`
 * on a section that can be collapsed or split out (they act on the section the
 * focus is in, and on no other), `⇧k` and `⇧j` on a column that has more than
 * fits, `o` `p` on an item with a place in a collection, `.` on a column with a menu, `Escape` on one that can be closed, and so
 * on. The keys drawn are the ones the user chose (`bindings`), but for the
 * ones in a mode or a field, which are not theirs to change.
 */
export function strataFooterKeys(
  context: StrataKeysContext,
  bindings: StrataKeyBindings,
): StrataFooterKey[] {
  const key = (action: KeyboardAction) =>
    strataKeyBindingLabel(bindings[action]);
  switch (context.overlay) {
    case "hints":
      return [
        { keys: [], label: "type a label to click it" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "map":
      return [
        { keys: [], label: "type a label to jump there" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "apps":
      return [
        { keys: [], label: "type a label to go there" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "new":
      return [
        { keys: [], label: "type a label to start it" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "commands":
      return [
        { keys: [], label: "type a label to run it" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "commands-search":
      return [
        { keys: [], label: "type to search" },
        { keys: ["↑", "↓"], label: "choices" },
        { keys: ["↵"], label: "turn on or off" },
        { keys: ["⌫"], label: "back" },
        { keys: ESCAPE, label: "list" },
      ];
    case "find":
      return [
        { keys: [], label: "type to search" },
        { keys: ["↑", "↓"], label: "matches" },
        { keys: ["↵"], label: "go to it" },
        { keys: ESCAPE, label: "cancel" },
      ];
    case "search":
      return [
        { keys: [], label: "type to search" },
        { keys: ["↓", "↵"], label: "results" },
        { keys: ESCAPE, label: "close" },
      ];
    case "search-results":
      return [
        {
          keys: [key(KeyboardAction.NEXT), key(KeyboardAction.PREVIOUS)],
          label: "results",
        },
        { keys: [key(KeyboardAction.OPEN)], label: "open" },
        { keys: [key(KeyboardAction.FIND)], label: "query" },
        { keys: ESCAPE, label: "close" },
      ];
    case null:
      break;
  }

  if (context.typing === "field") {
    return [{ keys: ESCAPE, label: "leave the field" }];
  }
  if (context.typing === "layer") {
    return [{ keys: ESCAPE, label: "close" }];
  }

  const keys: StrataFooterKey[] = [];
  if (context.columns > 1) {
    keys.push({
      keys: [
        key(KeyboardAction.COLUMN_PREVIOUS),
        key(KeyboardAction.COLUMN_NEXT),
      ],
      label: "columns",
    });
  }

  if (context.focus === "item") {
    keys.push(
      {
        keys: [key(KeyboardAction.NEXT), key(KeyboardAction.PREVIOUS)],
        label: "items",
      },
      { keys: [key(KeyboardAction.OPEN)], label: "open" },
    );
  } else if (context.focus === "section") {
    keys.push(
      {
        keys: [key(KeyboardAction.NEXT), key(KeyboardAction.PREVIOUS)],
        label: "sections",
      },
      { keys: [key(KeyboardAction.OPEN)], label: "go in" },
    );
    if (context.items > 0) {
      keys.push({ keys: [key(KeyboardAction.EDIT)], label: "items" });
    } else if (context.editable) {
      keys.push({ keys: [key(KeyboardAction.EDIT)], label: "edit" });
    }
    if (context.collapsible) {
      keys.push({ keys: [key(KeyboardAction.COLLAPSE)], label: "collapse" });
    }
    if (context.splittable) {
      keys.push({ keys: [key(KeyboardAction.SPLIT)], label: "split" });
    }
  } else if (context.sections > 0) {
    keys.push({
      keys: [key(KeyboardAction.NEXT), key(KeyboardAction.PREVIOUS)],
      label: "sections",
    });
  } else if (context.items > 0) {
    keys.push({
      keys: [key(KeyboardAction.NEXT), key(KeyboardAction.PREVIOUS)],
      label: "items",
    });
  }
  // A column that is a note, or has one and no list, is gone into by `e`: a
  // split column with a note, or a column with no sections.
  if (context.focus === "column" && context.items === 0 && context.editable) {
    keys.push({ keys: [key(KeyboardAction.EDIT)], label: "edit" });
  }
  if (context.split) {
    keys.push({ keys: [key(KeyboardAction.FOLD_BACK)], label: "fold back" });
  }

  keys.push({ keys: [key(KeyboardAction.HINTS)], label: "hints" });
  if (context.targets > 1) {
    keys.push({ keys: [key(KeyboardAction.MAP)], label: "map" });
  }
  if (context.commands) {
    keys.push({ keys: [key(KeyboardAction.COMMANDS)], label: "commands" });
  }
  keys.push({ keys: [key(KeyboardAction.NEW)], label: "new" });
  keys.push({ keys: [key(KeyboardAction.APPS)], label: "apps" });
  keys.push({ keys: [key(KeyboardAction.FIND)], label: "find" });
  if (context.position) {
    keys.push({
      keys: [
        key(KeyboardAction.POSITION_PREVIOUS),
        key(KeyboardAction.POSITION_NEXT),
      ],
      label: "prev next",
    });
  }
  if (context.scrolls) {
    keys.push({
      keys: [key(KeyboardAction.SCROLL_TOP), key(KeyboardAction.SCROLL_BOTTOM)],
      label: "top bottom",
    });
  }
  if (context.menu) {
    keys.push({ keys: [key(KeyboardAction.MENU)], label: "menu" });
  }
  if (context.focus === "item") {
    keys.push({ keys: [key(KeyboardAction.CLOSE)], label: "back" });
  } else if (context.closable) {
    keys.push({ keys: [key(KeyboardAction.CLOSE)], label: "close" });
  }
  return keys;
}
