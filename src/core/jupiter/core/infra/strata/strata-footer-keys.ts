import type { StrataFooterKey } from "#/core/infra/strata/strata-footer-key";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";

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
 * on a stack of sections, and so on.
 */
export function strataFooterKeys(
  context: StrataKeysContext,
): StrataFooterKey[] {
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
    case "find":
      return [
        { keys: [], label: "type to search" },
        { keys: ["↑", "↓"], label: "matches" },
        { keys: ["↵"], label: "go to it" },
        { keys: ESCAPE, label: "cancel" },
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
    keys.push({ keys: ["h", "l"], label: "columns" });
  }

  if (context.focus === "item") {
    keys.push(
      { keys: ["j", "k"], label: "items" },
      { keys: ["↵"], label: "open" },
    );
  } else if (context.focus === "section") {
    keys.push(
      { keys: ["j", "k"], label: "sections" },
      { keys: ["↵"], label: "go in" },
    );
    if (context.items > 0) {
      keys.push({ keys: ["e"], label: "items" });
    }
    keys.push(
      { keys: ["z"], label: "collapse" },
      { keys: ["c"], label: "split" },
    );
  } else if (context.sections > 0) {
    keys.push(
      { keys: ["j", "k"], label: "sections" },
      { keys: ["z"], label: "collapse" },
      { keys: ["c"], label: "split" },
    );
  } else if (context.items > 0) {
    keys.push({ keys: ["j", "k"], label: "items" });
  }
  if (context.split) {
    keys.push({ keys: ["⇧c"], label: "fold back" });
  }

  keys.push({ keys: ["s"], label: "hints" });
  if (context.targets > 1) {
    keys.push({ keys: ["a"], label: "map" });
  }
  keys.push(
    { keys: ["f"], label: "find" },
    { keys: ESCAPE, label: context.focus === "item" ? "back" : "close" },
  );
  return keys;
}
