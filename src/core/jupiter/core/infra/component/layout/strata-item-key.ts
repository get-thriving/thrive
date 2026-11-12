import { strataFocusItem } from "#/core/infra/component/layout/strata-focus-item";
import { strataOpenItem } from "#/core/infra/component/layout/strata-open-item";
import {
  strataFocusedItem,
  strataSectionItems,
} from "#/core/infra/component/layout/strata-section-items";
import {
  strataNextSection,
  type StrataStackKeyAction,
} from "#/core/infra/strata/strata-stack-key";

/**
 * Where the keys go into the list of a scope from. A **section** is gone into
 * by `e`, when it has the focus itself. A **column** (a split column, whose
 * section has no focus of its own, or one with no sections, such as a trunk) is
 * gone into by `e` wherever the focus is in it, and by `j`, to the first item,
 * and `k`, to the last.
 */
export type StrataItemEntry = "section" | "column";

/**
 * Item mode for one key (ADR 0021). With the focus on an item of `scope`, `j`
 * and `k` move between the items, stopping at the ends, and `↵` opens the one
 * that has it. Otherwise `e` goes into the list, to its first item, as above.
 * Says whether the key was taken, so the caller leaves it alone; what is not
 * taken is for the caller's other keys.
 */
export function strataItemKey(
  event: KeyboardEvent,
  action: StrataStackKeyAction,
  scope: HTMLElement | undefined,
  entry: StrataItemEntry,
): boolean {
  const items = scope === undefined ? [] : strataSectionItems(scope);
  const focused = strataFocusedItem();
  const onItem = focused === null ? -1 : items.indexOf(focused);

  if (onItem >= 0) {
    if (action === "open") {
      event.preventDefault();
      strataOpenItem(items[onItem]);
    } else if (action !== "items") {
      event.preventDefault();
      const next = strataNextSection(action, items.length, onItem);
      if (next !== null) {
        strataFocusItem(items[next]);
      }
    }
    return true;
  }

  const goesIn =
    action === "items" ||
    (entry === "column" && (action === "next" || action === "previous"));
  if (
    items.length > 0 &&
    goesIn &&
    (entry === "column" ||
      (scope !== undefined && scope === document.activeElement))
  ) {
    event.preventDefault();
    strataFocusItem(action === "previous" ? items[items.length - 1] : items[0]);
    return true;
  }
  return action === "items";
}
