import type { StrataScrollKeyAction } from "#/core/infra/strata/strata-scroll-key";
import { strataFocusItem } from "#/core/infra/component/layout/strata-focus-item";
import { strataColumnSections } from "#/core/infra/component/layout/strata-map-columns";
import {
  strataFocusedItem,
  strataSectionItems,
} from "#/core/infra/component/layout/strata-section-items";

const OWNER = "[data-strata-section], [data-strata-column]";

/**
 * Takes the selection to where `⇧k` and `⇧j` (or `Home` and `End`) took the
 * scrolling of a column: the first item or the last one. Without it the scroll
 * and `j` and `k` would each keep a place of their own, and `j` after `⇧k`, or
 * `k` after `⇧j`, would go on from the item that was selected before the jump
 * and not from the end it jumped to.
 *
 * It is the list the keyboard is in that moves: the list of the section or the
 * column the focused item belongs to, or else, with the keyboard on the column
 * itself, the list the column has of its own. A column that has a stack of
 * sections and no item selected keeps what it did at the top, where the place
 * `j` and `k` had is forgotten so they start from the first, and at the bottom
 * the last section takes the focus. Says whether something took the focus.
 */
export function strataSelectEnd(
  column: HTMLElement,
  to: StrataScrollKeyAction,
): boolean {
  const focused = strataFocusedItem();
  const inColumn =
    focused !== null && focused.closest("[data-strata-column]") === column;
  const scope = inColumn ? focused.closest<HTMLElement>(OWNER) : column;
  const sections = strataColumnSections(column);
  if (scope !== null && (inColumn || sections.length === 0)) {
    const items = strataSectionItems(scope);
    const item = to === "top" ? items[0] : items[items.length - 1];
    if (item !== undefined) {
      strataFocusItem(item);
      return true;
    }
  }
  if (to === "bottom" && sections.length > 0) {
    sections[sections.length - 1].focus({ preventScroll: true });
    return true;
  }
  return false;
}
